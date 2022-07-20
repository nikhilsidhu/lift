const express = require('express');
const router = express.Router({mergeParams: true});
const sets = require('../controllers/sets');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.post('/', isLoggedIn, catchAsync(sets.createSet));

router.route('/:setId')
    .put(isLoggedIn, catchAsync(sets.editSet))
    .delete(isLoggedIn, catchAsync(sets.deleteSet));

module.exports = router;