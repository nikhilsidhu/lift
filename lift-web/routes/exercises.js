const express = require('express');
const router = express.Router({mergeParams: true});
const Workout = require('../models/workout');
const Exercise = require('../models/exercise');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = new Exercise(req.body.exercise);
    workout.exercises.push(exercise);
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
}))

router.delete('/:exerciseId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, exerciseId } = req.params;
    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/workouts/${id}`);
}))

module.exports = router;