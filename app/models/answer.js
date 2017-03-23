// Set up mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Export our mongoose model, with a user name and friends list
module.exports = mongoose.model('Answer', new Schema({
    user_id: String,
    task_id: String,
    answers: [{
    	answer_text: String,
    	answer_picture: 
    		{ 
    			data: Buffer, 
    			contentType: String 
    		}
    }]
}));