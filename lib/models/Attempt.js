const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    recipeId: {
        type: Number,
        required: true
    },
    dateOfEvent: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
    },
    rating: {
        type: Number,
    }
});

module.exports = mongoose.model('Attempt', schema);
