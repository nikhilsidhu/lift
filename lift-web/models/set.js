const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setSchema = new Schema({
    repsRequired: {
        // goal reps
        type: Number,
        required: false
    },
    repsCompleted: {
        // reps actually completed
        type: Number,
        required: false
    },
    weightRequired: {
        // weight required for the st (if doing strength training)
        type: Number,
        required: false
    },

    weightCompleted: {
        //actual weight lifted
        type: Number,
        required: false
    },
    setTime: {
        // duration of set (if timed)
        type: Number,
        required: false
    },

    notes: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Set', setSchema);