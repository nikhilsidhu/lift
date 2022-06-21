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

WorkoutSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await exercise.deleteMany({
      _id: {
        $in: doc.exercises
      }
    })
  }
})

module.exports = mongoose.model('Workout', WorkoutSchema);