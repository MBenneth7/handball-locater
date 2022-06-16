if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
//IMAGE UPLOAD
const multer = require('multer');
const {storage} = require('./cloudinary/index');
const upload = multer({ storage });


const User = require('./models/user');
const Park = require('./models/park');
const Comment = require('./models/comment');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync'); 

//EXTERNAL MIDDLEWARE FROM 'middleware.js'
const{validateComment, isLoggedIn, isCommentAuthor} = require('./utilities/middleware');

//ROUTES
const parkRoutes = require('./routes/parks');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const { findById } = require('./models/user');


//USING MONGO DB
main().catch(err => console.log(err, 'OH NO MONGO ERROR!!!'));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/handball');
  console.log('Connected to HandBall DB')
}

//SEARCHBAR USE
app.use(express.json());

//SERVING PUBLIC ASSETS W/EXPRESS
//WILL DEFAULT INTO SEARCHING THE 'public' DIRECTORY
app.use(express.static(path.join(__dirname,'public')));

////////// **PARSING 'post' REQUESTS **//////////////
app.use(express.urlencoded({extended: true}));
/////////////////////////////////////////////////////

////METHOD OVERRIDE, USE TO DO OTHER REQUESTS BESIDES 'get' AND 'post'////
//USE: npm i method-override
app.use(methodOverride('_method'));
//////////////////////////////////////////////////////////////////////////

//USING 'ejs' TO SET UP TEMPLATES FOR WEBPAGES/////////

//EJS MATE
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//////////////////////////////////////////////////////
//////////////** EXPRESS SESSION & COOKIES **//////////////////

const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //EXPIRATION FOR COOKIE
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

///////////////////////////////////////////////////////////////
////////////////////** FLASH **////////////////////// 

app.use(flash());

/////////////////////////////////////////////////////
//////** PASSPORT (LOGINS & AUTHENTICATION) **///////

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////////////////////
//////////////** GLOBAL MIDDLEWARE **////////////////

app.use((req,res,next)=>{

    console.log(req.session);

    //GRANTING ALL ROUTES TO 'user' PROVIDED BY PASSPORT 'req.user'
    res.locals.currentUser = req.user;

    //GRANTING ROUTES GLOBAL ACCESS TO FLASH ON EACH ROUTE
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

/////////////////////////////////////////////////////
/////////////////////**ROUTES**//////////////////////

app.use('/parks', parkRoutes);
app.use('/parks/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


//HOMEPAGE
app.get('/',(req,res)=>{
    res.render('home');
});

//ADD IMAGES
app.get('/parks/:id/addImages', catchAsync(async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    res.render('parks/addImages', {park});
}));

//upload.single('image')

//POST IMAGES
app.post('/parks/:id',upload.array('image'),catchAsync(async(req,res)=>{
    console.log(req.body, req.files);
    res.send('IT WORKED!!!');
}));

//POST REQUEST FOR COMMENTS
app.post('/parks/:id/comments', validateComment, isLoggedIn, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    const comment = new Comment(req.body.comment);

    //ADDING THE 'req.user_id' TO THE AUTHOR FIELD OF OUR COMMENT DATA, ADDING A AUTHOR TO A COMMENT
    comment.author = req.user._id;

    
    //ADDING A 'comment'  TO A SPECEFIC PARK
    park.comments.push(comment);

    await comment.save();
    await park.save();

    req.flash('success', 'Comment successfully made!!!');
    res.redirect(`/parks/${park._id}`);
}));

//DELETE COMMENTS
app.delete('/parks/:id/comments/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async(req,res)=>{
    const {id, commentId} = req.params;

    await Park.findByIdAndUpdate( id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    req.flash('success', 'Deleted Comment!!!');
    res.redirect(`/parks/${id}`);
}));

//POST REQUEST FOR SEARCH RESULTS
app.post('/', catchAsync(async(req,res) =>{
    let payload = req.body.payload.trim();
    //SEARCH FOR PARK AND THE REGEX EXPRESSION HANDLES CASE SENSITIVITY
    let search = await Park.find( { name: { $regex: new RegExp('^' + payload + '.*', 'i') } } ).exec();
    //LIMIT SEARCH RESULTS
    search = search.slice(0,10);
    res.send({payload: search});
}));

//MIDDLEWARE ROUTE HANDLER FOR ROUTES NOT FOUND
app.all('*',(req,res,next)=>{
    //PASSING THE ERROR TO THE MIDDLEWARE ERROR HANDLER FOR ANYTHING
    next(new ExpressError('Page not found', 404));
});

//MIDDLEWARE ERROR HANDLER FOR ANYTHING
app.use((err,req,res,next)=>{
    //DEFAULT ASSIGNMENT IF 'statusCode' ISN'T FOUND IN 'err'
    const {statusCode = 500} = err;
    //DEFAULT 'err.message' IF NO 'err.message'
    if(!err.message) err.message = "That's our fault...";
    //SENDING BACK ERROR
    res.status(statusCode).render('error', {err});
});

////////////////////////////////////////////////////

//LISTENER
app.listen(3000,()=>{
    console.log('Listening on Route 3000!!!');
});




