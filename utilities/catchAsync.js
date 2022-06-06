//A FUNCTION THAT CATCHES ERRORS, RETURNS AND HANDS IT OVER TO THE NEXT FUNCTION
//BASICALLY OUR 'TRY AND CATCH' METHOD FOR HANDLING ERRORS 
module.exports = func => {
    return (req, res, next)=>{
        func(req, res, next).catch(next);
    }
}