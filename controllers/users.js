const User = require("../models/user");


module.exports.renderSignupform = (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
 
}


module.exports.renderLoginform = (req, res) => {
    res.render("users/login.ejs");
  }
 

  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout =  (req, res) => {
    req.logout((err)=>{
        if(err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
});
}
