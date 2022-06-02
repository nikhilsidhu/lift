
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
      type: Schema.Types.ObjectId,
      ref: 'Set'
    }
  ]
});

module.exports = mongoose.model('Exercise', exerciseSchema);