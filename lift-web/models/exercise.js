
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: {
    // name of exercise
    type: String,
    required: true,
  },
  sets: [
    {
      weight: {
        type: Number,
        required: true,
        min: 0
      },

      reps: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ]
});

module.exports = mongoose.model('Exercise', exerciseSchema);