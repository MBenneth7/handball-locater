const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const Park = require('./models/park');
const User = require('./models/user');
const Review = require ('./models/review');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const {validateReview} = require('./utilities/middleware');



//USING MONGO DB
main().catch(err => console.log(err, 'OH NO MONGO ERROR!!!'));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/handball');
  console.log('Connected to HandBall DB')
}

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

//USING 'ejs' TO SET UP TEMPLATES FOR WEBPAGES//////

//EJS MATE
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

///////////////////////////////////////////////////

/////////////////////**ROUTES**//////////////////////

app.get('/',(req,res)=>{
    res.render('home');
});

//INDEX OF PARKS
app.get('/parks',async(req,res)=>{
    const parks = await Park.find();  
    res.render('parks/index', {parks});
});

//REGISTER PAGE FOR USER
app.get('/register',(req,res)=>{
    res.render('auth/register');
});

//SAVING USER DATA INTO DB
app.post('/register',catchAsync(async(req,res)=>{
    const {username, email, password} = req.body;

    const user = new User({
        username: username,
        email: email,
        password: password
    });

    await user.save();
    console.log(user);

    res.redirect('/parks');
    //res.send(req.body);
}));

//LOGIN PAGE FOR USER
app.get('/login',(req,res)=>{
    res.render('auth/login');
});

//LOGGING IN
app.post('/login',catchAsync(async(req,res)=>{
    const{username, password} = req.body;
    const user = await User.find({username});

    //password!==user[0].password

    if(password!==user[0].password){
        console.log('Invalid Login');
        res.redirect('/parks');
    }
    else{
        console.log('Login Successful, Welcome!!!');
        res.redirect('/parks');
    }
}));

//PROFILE PAGE OF PARK
app.get('/parks/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    //'populate' USED TO SHOW 'reviews' ASSOCIATED W/PARK
    const park = await Park.findById(id).populate('reviews');
    console.log(park);
    res.render('parks/show', {park});
}));

//POSTING A REVIEW FOR A PARK
app.post('/parks/:id/reviews', validateReview, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    const review = new Review(req.body.review);

    //ADDING A 'review'  TO A SPECEFIC PARK
    park.reviews.push(review);

    await review.save();
    await park.save();

    res.redirect(`/parks/${park._id}`);
}));

//DELETING A REVIEW FOR A PARK
app.delete('/parks/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Park.findByIdAndUpdate( id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/parks/${id}`);
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




