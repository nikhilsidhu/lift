const Workout = require('../models/workout');
const Exercise = require('../models/exercise');

module.exports.createExercise = async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = new Exercise(req.body.exercise);
    exercise.user = req.user;
    console.log('THE REQ USER IS: ', req.user);
    console.log('THE USER OF THIS EXERCISE IS: ', exercise.user);
    workout.exercises.push(exercise);
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
}

module.exports.deleteExercise = async (req, res) => {
    const { id, exerciseId } = req.params;
    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/workouts/${id}`);
}