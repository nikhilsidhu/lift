
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  exerciseName: {
    // name of exercise
    type: String,
    required: true,
  },
  sets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Set'
    }
  ]/* ,
    sets: {
      // array of sets completed
      type: [setSchema],
      required: false,
    },
    exerciseTime: {
      // for timed exercises
      type: Number,
      required: false,
    },
    exerciseNote: {
      // user notes about this exercise
      type: String,
      required: false,
    }, */
});

module.exports = mongoose.model('Exercise', exerciseSchema);