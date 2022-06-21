const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// TODO: add workout intensity (rate from 1-5)?
const WorkoutSchema = new Schema({
  name: {
    // name workout (default option too)
    type: String,
    required: true,
  },
  date: {
    // date of workout
    type: Date,
    required: true,
  },

  exercises: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    }
  ]
});

module.exports = mongoose.model('Workout', WorkoutSchema);