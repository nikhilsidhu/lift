const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, error => {
            if (error) return next(error);
            req.flash('success', 'Welcome to Lift!');
            res.redirect('/workouts');
        })

    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.logIn = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/workouts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return (next(error));
        }
        req.flash('success', 'Successfully logged out!');
        res.redirect('/workouts');
    });
}