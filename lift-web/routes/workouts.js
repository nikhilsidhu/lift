const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const temporalDate = require('../utils/temporalDate.js');
const Workout = require('../models/workout');
const User = require('../models/user');
const { isLoggedIn, isOwner, validateWorkout } = require('../middleware');

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate('workouts');
    const workouts = currentUser.workouts;
    res.render('workouts/index', { workouts, temporalDate, });
}))

router.post('/', isLoggedIn, validateWorkout, catchAsync(async (req, res) => {
    const workout = new Workout(req.body.workout);
    const currentUser = req.user;
    workout.user = currentUser;
    currentUser.workouts.push(workout);
    await workout.save();
    await currentUser.save();
    req.flash('success', 'Successfully made a new workout!');
    res.redirect(`/workouts/${workout._id}`);
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('workouts/new');
})

router.get('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
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
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/edit', { workout });
}))

router.put('/:id', isLoggedIn, validateWorkout, catchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    req.flash('success', 'Successfully updated workout!');
    res.redirect(`/workouts/${workout._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { workouts: id}});
    await Workout.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted workout.');
    res.redirect('/workouts');
}))

module.exports = router;