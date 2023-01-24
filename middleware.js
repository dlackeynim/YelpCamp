module.exports.isLoggedIn = (req, res, next) => {
    console.log("Req.User....", req.user)
    if(!req.isAuthenticated()){
    req.flash('error', 'You must be signed in first');
    return res.redirect('/login');
    }
    next();
}

