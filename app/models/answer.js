var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Answer', new Schema({
    user_id: String,
    task_id: String,
    answers: [{
    	answer_text: String,
        answer_picture_url: String
    	/*answer_picture: 
    		{ 
    			data: Buffer, 
    			contentType: String 
    		}*/
    }]
}));