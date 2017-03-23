// Set up mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Export our mongoose model, with a user name and friends list
module.exports = mongoose.model('Task', new Schema({
    title: String,
    description: String,
    reward: Number,
    estimated_time: Number,
    location: {
    	coordinate_x: String,
    	coordinate_y: String,
    },
    items: [{
    	item_question: String,
    	item_text: String,
    	item_picture: 
    		{ 
    			data: Buffer, 
    			contentType: String 
    		},
    	item_options: [String],
    }],
    answer_type: String,
    answer: {
    	user_id: String,
    	answer_text: String,
    	answer_picture: 
    		{ 
    			data: Buffer, 
    			contentType: String 
    		}
    }
}));