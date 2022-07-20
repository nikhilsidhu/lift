const Exercise = require('../models/exercise');
const Set = require('../models/set');

module.exports.createSet = async (req, res) => {
    const exercise = await Exercise.findById(req.params.exerciseId);
    const set = new Set(req.body.set);
    exercise.sets.push(set);
    await set.save();
    await exercise.save();
    res.redirect(`/workouts/${req.params.id}/?exercise=exercise`);
}

module.exports.editSet = async (req, res) => {
    const setId = req.params.setId;
    await Set.findByIdAndUpdate(setId, { ...req.body.set });
    res.redirect(`/workouts/${req.params.id}`);
}

module.exports.deleteSet = async (req, res) => {
    const workoutId = req.params.id;
    const exerciseId = req.params.exerciseId;
    const setId = req.params.setId;
    await Exercise.findByIdAndUpdate(exerciseId, { $pull: { sets: setId } })
    await Set.findByIdAndDelete(req.params.setId);
    res.redirect(`/workouts/${workoutId}`);
}