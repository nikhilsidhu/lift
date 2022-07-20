const express = require('express');
const router = express.Router({mergeParams: true});
const exercises = require('../controllers/exercises');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner, validateWorkout } = require('../middleware');

router.post('/', isLoggedIn, isOwner, catchAsync(exercises.createExercise));

router.route('/:exerciseId')
    .put(isLoggedIn, isOwner, catchAsync(exercises.editExercise))
    .delete(isLoggedIn, isOwner, catchAsync(exercises.deleteExercise));


module.exports = router;