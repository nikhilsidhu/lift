const express = require('express');
const router = express.Router({mergeParams: true});
const Workout = require('../models/workout');
const Exercise = require('../models/exercise');
const ExpressError = require('../utils/ExpressError');
const temporalDate = require('../utils/temporalDate.js');
const catchAsync = require('../utils/catchAsync');


router.post('/', catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = new Exercise(req.body.exercise);
    workout.exercises.push(exercise);
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
}))

router.delete('/:exerciseId', catchAsync(async (req, res) => {
    const { id, exerciseId } = req.params;
    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/workouts/${id}`);
}))

router.post('/:eid/sets', catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = await Exercise.findById(req.params.eid);
    const set = req.body.set;
    exercise.sets.push(set);
    await exercise.save();
    // await workout.save();
    res.redirect(`/workouts/${req.params.id}/?exercise=exercise`);
}))

router.put('/:exerciseId/sets/:setId', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { exerciseId } = req.params;
    const setId = req.params.setId;
    const set = Set.findById(setId);

    //await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    await Set.findByIdAndUpdate(setId, { ...req.body.set });

    res.redirect(`/workouts/${id}`);
}))

router.delete('/:exerciseId/sets/:setId', catchAsync(async (req, res) => {
    const workoutId = req.params.id;
    const exerciseId = req.params.exerciseId;
    const setId = req.params.setId;
    await Exercise.findByIdAndUpdate(exerciseId, { $pull: { sets: setId } })
    await Set.findByIdAndDelete(req.params.setId);
    res.redirect(`/workouts/${workoutId}`);
}))

module.exports = router;