const express = require('express');
const router = express.Router({mergeParams: true});
const exercises = require('../controllers/exercises');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner } = require('../middleware');

router.post('/', isLoggedIn, isOwner, catchAsync(exercises.createExercise));

router.delete('/:exerciseId', isLoggedIn, isOwner, catchAsync(exercises.deleteExercise));

module.exports = router;