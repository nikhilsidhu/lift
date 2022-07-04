const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const temporalDate = require('../utils/temporalDate.js');
const Workout = require('../models/workout');
const Exercise = require('../models/exercise');
const { workoutSchema } = require('../schemas');

const validateWorkout = (req, res, next) => {
    const { error } = workoutSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const workouts = await Workout.find({});
    res.render('workouts/index', { workouts, temporalDate, });

}))

router.post('/', validateWorkout, catchAsync(async (req, res) => {
    // if (!req.body.workout) throw new ExpressError('Invalid Workout Data', 400);
    const workout = new Workout(req.body.workout);
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
}))

router.get('/new', (req, res) => {
    res.render('workouts/new');
})

router.get('/:id', catchAsync(async (req, res) => {
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

router.get('/:id/edit', catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/edit', { workout });
}))


router.put('/:id', validateWorkout, catchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    res.redirect(`/workouts/${workout._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Workout.findByIdAndDelete(id);
    res.redirect('/workouts');
}))

module.exports = router;