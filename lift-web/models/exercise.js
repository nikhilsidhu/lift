const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Set = require('./set');


const ExerciseSchema = new Schema({
  name: {
    // Name of exercise
    type: String,
    required: true,
  },
  sets: [{
    type: Schema.Types.ObjectId,
    ref: 'Set'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

ExerciseSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Set.deleteMany({
      _id: {
        $in: doc.sets
      }
    })
  }
})

module.exports = mongoose.model('Exercise', ExerciseSchema);