const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Exercise = require('./exercise');

const WorkoutSchema = new Schema({
  // Name of workout
  name: {
    type: String,
    required: true
  },
  // Date workout was completed
  date: {
    type: Date,
    required: true
  },
  // Exercises that were completed
  exercises: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  // User that completed the workout
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    required: false
  }
});

WorkoutSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Exercise.deleteMany({
      _id: {
        $in: doc.exercises
      }
    })
  }
})

module.exports = mongoose.model('Workout', WorkoutSchema);