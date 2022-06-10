const User = require('../models/user');
const passport = require('passport');

//DISPLAYING OUR REGISTER FORM
module.exports.renderRegister = (req,res)=>{
    res.render('auth/register');
}

//REGISTERING A USER W/REGISTER FORM
module.exports.register = async(req,res,next)=>{
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
}

//DISPLAYING OUR LOGIN FORM
module.exports.renderLogin = (req,res)=>{
    res.render('auth/login');
}

//PROCESSING LOGIN W/PASSPORT 
module.exports.login = (req,res)=>{
    //'req.user.username' ACCESSIBLE FROM OUR GLOBAL MIDDLEWARE WHICH PROVIDES res.local
    req.flash('success', `Welcome Back ${req.user.username}!!!`);

    //REDIRECTING USER BACK TO PAGE AFTER LOGGING IN
    const redirectUrl = req.session.returnTo || '/parks/search';

    //DELETING THE 'req.session.returnTo'
    delete req.session.returnTo;

    res.redirect(redirectUrl);
}

//LOGGING OUT W/PASSPORT
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        //DELETING THE 'req.session.returnTo'
        delete req.session.returnTo;
        
        req.flash('success', 'Successfully logged out!!!');
        res.redirect('/parks/search');
    });
}