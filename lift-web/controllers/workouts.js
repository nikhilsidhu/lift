const User = require('../models/user');
const Workout = require('../models/workout');
const temporalDate = require('../utils/temporalDate');

module.exports.index = async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate('workouts');
    const workouts = currentUser.workouts;
    res.render('workouts/index', { workouts, temporalDate, });
}

module.exports.renderNewWorkoutForm = (req, res) => {
    res.render('workouts/new');
}

module.exports.createWorkout = async (req, res) => {
    const workout = new Workout(req.body.workout);
    const currentUser = req.user;
    workout.user = currentUser;
    currentUser.workouts.push(workout);
    await workout.save();
    await currentUser.save();
    req.flash('success', 'Successfully made a new workout!');
    res.redirect(`/workouts/${workout._id}`);
}

module.exports.showWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id)
        .populate({
            path: 'exercises',
            model: 'Exercise',
            populate: {
                path: 'sets',
                model: 'Set'
            }
    })
    res.render('workouts/show', { workout, temporalDate });
}

module.exports.renderEditForm = async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/edit', { workout });
}

module.exports.editWorkout = async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    req.flash('success', 'Successfully updated workout!');
    res.redirect(`/workouts/${workout._id}`);
}

module.exports.deleteWorkout = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { workouts: id}});
    await Workout.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted workout.');
    res.redirect('/workouts');
}