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

const Park = require('./models/park');
const User = require('./models/user');
const Review = require ('./models/review');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('./utilities/middleware');

//ROUTES
const parkRoutes = require('./routes/parks');



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



app.get('/',(req,res)=>{
    res.render('home');
});

//REGISTER PAGE FOR USER
app.get('/register',(req,res)=>{
    res.render('auth/register');
});

//SAVING USER DATA INTO DB
app.post('/register',catchAsync(async(req,res,next)=>{

    //TRY & CATCH FOR ANY POTENTIAL ERRORS IN REGISTERING
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});

        //PASSPORT register(), TAKES 'password' HASHES AND SALTS IT, SAVES USER INTO DATABASE 
        const registeredUser = await User.register(user, password);

        //PASSPORT 'login()' REGISTERS A USER AND SIGNS THEM IN
        req.login(registeredUser, err =>{
            //ERROR HANDLER, HANDS IT OVER TO OUR ERROR HANDLER BY MIDDLEWARE
            if(err) return next(err);

            console.log(registeredUser);
            req.flash('success',`Welcome to Handball Locator ${user.username}!!!`);
            res.redirect('/parks');
        });
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}));

//LOGIN PAGE FOR USER
app.get('/login',(req,res)=>{
    res.render('auth/login');
});

//LOGGING IN
//PASSPORT MIDDLEWARE ADDED TO AUTHETICATE USER
app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async(req,res)=>{

    //'req.user.username' ACCESSIBLE FROM OUR GLOBAL MIDDLEWARE WHICH PROVIDES res.local
    req.flash('success', `Welcome Back ${req.user.username}!!!`);

    //REDIRECTING USER BACK TO PAGE AFTER LOGGING IN
    const redirectUrl = req.session.returnTo || '/parks';

    //DELETING THE 'req.session.returnTo'
    delete req.session.returnTo;

    res.redirect(redirectUrl);
}));

//LOGOUT
app.get('/logout', (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'Successfully logged out!!!');
        res.redirect('/parks');
    });
})

//POSTING A REVIEW FOR A PARK
app.post('/parks/:id/reviews', isLoggedIn, validateReview, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const park = await Park.findById(id);
    const review = new Review(req.body.review);

    //ADDING THE 'req.user_id' TO THE AUTHOR FIELD OF OUR REVIEW DATA, ADDING A AUTHOR TO A REVIEW
    review.author = req.user._id;

    //ADDING A 'review'  TO A SPECEFIC PARK
    park.reviews.push(review);

    await review.save();
    await park.save();

    req.flash('success', 'Review successfully made!!!');
    res.redirect(`/parks/${park._id}`);
}));

//DELETING A REVIEW FOR A PARK
app.delete('/parks/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Park.findByIdAndUpdate( id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Deleted Review!!!');
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




