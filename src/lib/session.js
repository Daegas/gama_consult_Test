module.exports = {
    //For routes that just a logged user is allowed to
    loggedEnable(req, res, next) {
        if(req.isAuthenticated()) { //passport method
            return next();
        }
        return res.redirect('/user/signin');
    },

    //For routes that user is not allowed when login
    //like (user/signup and user/signin)
    loggedBlock(req, res, next) { 
        if(req.isAuthenticated()) {
            return res.redirect('/user/profile');
        }
        return next();
    }
}