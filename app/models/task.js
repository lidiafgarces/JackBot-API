var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Task', new Schema({
    title: String,
    description: String,
    reward: Number,
    number_of_answers: Number,
    flag_out_users: [String],
    review_task: Boolean,
    location: {
    	coordinate_x: String,
    	coordinate_y: String,
    },
    items: [{
    	item_question: String,
    	item_text: String,
    	item_picture_url: String,
    	/*item_picture: 
    		{ 
    			data: Buffer, 
    			contentType: String 
    		},*/
    	item_options: [String],
    	item_answer_type: String,
    }],
    answers: [{
	    user_id: String,
	    questions_answers: [{
	    	answer_text: String,
	        answer_picture_url: String
	    	/*answer_picture: 
	    		{ 
	    			data: Buffer, 
	    			contentType: String 
	    		}*/
	    }]
	}]
}));