// Set up mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Export our mongoose model, with a user name and friends list
module.exports = mongoose.model('Task', new Schema({
    title: String,
    description: String,
    reward: Number,
    location: String,
    item: {
    	item_question: String,
    	item_picture: Buffer,
    	item_options: [String],
    },
    answer_type: String
}));