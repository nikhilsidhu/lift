const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema({
    weightCompleted: {
        type: Number,
        required: false
    },
    repsCompleted: {
        type: Number,
        required: false
    },
    timeCompleted: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Set', SetSchema);