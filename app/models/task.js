var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Task', new Schema({
    title: String,
    description: String,
    reward: Number,
    number_of_answers: Number,
    flag_out_users: [String],
    needs_review: Boolean,
    webhook_url: {
    	host: String,
    	port: String,
    	path: String,
    },
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
	}],
	review_ids: {
    	task_id: String,
    	answer_id: String,
    },
    answers_to_review: [{
	    user_id: String,
	    reviews: [Boolean],
	    questions_answers: [{
	    	answer_text: String,
	        answer_picture_url: String
	    	/*answer_picture: 
	    		{ 
	    			data: Buffer, 
	    			contentType: String 
	    		}*/
	    }]
	}],
	answers_accepted: [{
	    user_id: String,
	    reviews: [Boolean],
	    questions_answers: [{
	    	answer_text: String,
	        answer_picture_url: String
	    	/*answer_picture: 
	    		{ 
	    			data: Buffer, 
	    			contentType: String 
	    		}*/
	    }]
	}],
	answers_rejected: [{
	    user_id: String,
	    reviews: [Boolean],
	    questions_answers: [{
	    	answer_text: String,
	        answer_picture_url: String
	    	/*answer_picture: 
	    		{ 
	    			data: Buffer, 
	    			contentType: String 
	    		}*/
	    }]
	}],
}));