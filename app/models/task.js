var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Task', new Schema({
    title: String,
    description: String,
    reward: Number,
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
    }]
}));