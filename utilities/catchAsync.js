//A FUNCTION THAT CATCHES ERRORS, RETURNS AND HANDS IT OVER TO THE NEXT FUNCTION
//BASICALLY OUR 'TRY AND CATCH' METHOD FOR HANDLING ERRORS

// JJ comments: Hmm, not a big fan of this. As a reader of your code i'm wondering
// 1) when are the times we are actually using this, in what specific scenario do we need to ignore errors.
// 2) i'm wondering if it's better to handle certain errors right then and there, also we should probably log out errors right
//    for instance if your user location doesn't work, and it crashes the app I we could do some print statements to the server instead
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
