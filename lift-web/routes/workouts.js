const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner, validateWorkout } = require('../middleware');
const workouts = require('../controllers/workouts');

router.route('/')
    .get(isLoggedIn, catchAsync(workouts.index))
    .post(isLoggedIn, validateWorkout, catchAsync(workouts.createWorkout));

router.get('/new', isLoggedIn, workouts.renderNewWorkoutForm);

router.route('/:id', )
    .get(isLoggedIn, isOwner, catchAsync(workouts.showWorkout))
    .put(isLoggedIn, validateWorkout, catchAsync(workouts.editWorkout))
    .delete(isLoggedIn, catchAsync(workouts.deleteWorkout));

router.get('/:id/edit', isLoggedIn, catchAsync(workouts.renderEditForm));

module.exports = router; 