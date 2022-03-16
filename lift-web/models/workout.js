const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// TODO: add workout intensity (rate from 1-5)?
const WorkoutSchema = new Schema({
    workoutName: {
      // name workout (default option too)
      type: String,
      required: true,
    },
    workoutDate: {
      // date of workout
      type: Date,
      required: true,
    }/*,
    workoutTime: {
      // how long was the whole workout
      type: Number,
      required: true,
    },
    workoutNote: {
      // user note about entire workout
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, */
  });

  module.exports = mongoose.model('Workout', WorkoutSchema);