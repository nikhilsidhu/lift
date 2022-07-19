const mongoose = require('mongoose');
const { workoutSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Workout = require('./models/workout');
const Exercise = require('./models/exercise');

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateWorkout = (req, res, next) => {
    const {
        error
    } = workoutSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const {
        id
    } = req.params;
    const isValidWorkoutId = isValidId(id);
    const workout = await Workout.findById(id);

    if (!isValidWorkoutId || !workout) {
        req.flash('error', 'This workout does not exist.');
        return res.redirect('/workouts');
    }

    if (!workout.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect('/login');
    }

    const { exerciseId } = req.params;

    if (exerciseId && isValidId(exerciseId)) {

        const exercise = await Exercise.findById(exerciseId);

        if (!exercise) {
            req.flash('error', 'This exercise does not exist.');
            return res.redirect('/workouts');
        }

        if (!exercise.user.equals(req.user._id)) {
            req.flash('error', 'You do not have permission.');
            return res.redirect('/login');
        }
    }
    next();
}