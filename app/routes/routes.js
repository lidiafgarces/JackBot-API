// Set up express and include our Task model
var express = require('express');
var Task = require('../models/task');
//var Answer = require('../models/answer');
var http = require("http");

var router = express.Router();

router.route('/tasks')

.post(function(req,res){

    var task = new Task();
  
    task.title = req.body.title; 
    task.description = req.body.description; 
    task.reward = req.body.reward;
    task.number_of_answers = req.body.number_of_answers;
    task.flag_out_users = req.body.flag_out_users;
    task.review_task = req.body.review_task;
    task.webhook_url = req.body.webhook_url;
    task.location = req.body.location;
    task.items = req.body.items;
    task.answer_type = req.body.answer_type;
    task.answers = [];
    task.answers_to_review = [];
    task.answers_rejected = [];
    task.needs_review = req.body.needs_review || false;
    task.review_ids = {};

    var mandatoryFilled = task.title && task.description && task.reward && (task.items.length>0) && task.number_of_answers;

    for(itemIdx in req.body.items){
        if (!req.body.items[itemIdx].item_question) mandatoryFilled=false;
        if (!req.body.items[itemIdx].item_answer_type) mandatoryFilled=false;
    }

    if(req.body.items.length>10) {
        res.status('400').send('Bad Request. The maximum number of item is 10.');
    }else{
        if(mandatoryFilled){
            task.save(function(err, task){
                if (err) { res.send(err); }
                res.json({ message: 'We have created a new task! The id for the task is ' + task.id, task_id: task.id});
            });
        }else{
            res.status('400').send('Bad Request. A mandatory field is empty.');
        }
    }

})

.get(function(req,res){

    Task.find().select('-answers').exec(function(err, tasks){
        if (err){ return res.send(err); }

        res.json(tasks);
    });

})

router.route('/tasks/todo')

.get(function(req,res){

    Task.find({ $where : "(this.answers.length + this.answers_to_review.length) >= this.number_of_answers" }).select('-answers').exec(function(err, tasks){
        if (err){ return res.send(err); }

        res.json(tasks);
    });

})

router.route('/tasks/:task_id')

.get(function (req,res){
    console.log(req.params.task_id);

    Task.findById(req.params.task_id, function(err, task){
        if (err){ return res.send(err); }

        res.json(task);
    });
})

.put(function(req,res){
    Task.findById(req.params.task_id, function(err, task){
        if (err){ return res.send(err); }

        task.title = req.body.title; 
        task.description = req.body.description; 
        task.reward = req.body.reward;
        task.number_of_answers = req.body.number_of_answers;
        task.flag_out_users = req.body.flag_out_users;
        task.review_task = req.body.review_task;
        task.location = req.body.location;
        task.items = req.body.items;
        task.answer_type = req.body.answer_type;
        task.answers = [];

        task.save(function(err){
            if (err) { res.send(err); }

            res.json({ message: 'Task Updated!' });
        });
    });
})

.delete(function(req, res){
    Task.remove({_id:req.params.task_id}, function(err, task){
        if (err){ return res.send(err); }

        res.json({ message: 'Task successfully removed!' });
    });
})

router.route('/tasks/:task_id/answers')

.post(function(req,res){
    if(req.body.answers.length>0){
        Task.findById(req.params.task_id, function(err, task){
            if (err){ return res.send(err); }

            if(req.body.answers.length !== task.items.length){
                return res.status('400').send('Bad Request. The number of questions and the number answers differs.');
            }

            var answer = {};

            answer.user_id = req.body.user_id; 
            answer.questions_answers = req.body.answers;

            if(task.review_ids.task_id){
                console.log('This is a review task');
                updateReviews(task);
            }

            console.log('This is no a review task. Does the task need review? ' +  task.needs_review);

            if(task.needs_review){
                console.log('The task needs review');
                task.answers_to_review.push(answer);
                task.save(function(err, updatedTask){
                    if (err) { return res.send(err); }
                    createReviewTask(task, function(err, response){
                        if (err) { return res.send(err); }
                        console.log('\n');
                        console.log(response);
                        res.json(response);
                    });
                });
            }else{
                console.log('The task doesnt need review');
                task.answers.push(answer);
                task.save(function(err, updatedTask){
                if (err) { return res.send(err); }
                    //if(!response.message) {
                        response = { 
                            message: 'We have created a new answer! The id of the answer is ' + task.answers[task.answers.length-1].id, 
                            answer_id: task.answers[task.answers.length-1].id
                        };
                        console.log(task.webhook_url);
                        if(task.webhook_url.host && task.webhook_url.path) sendAnswerNotification(task.webhook_url, task.answers[task.answers.length-1]);
                    //}
                    res.json(response);
                });
            }

        });
    }else{
        res.status('400').send('Bad Request. A mandatory field is empty.');
    }
})

.get(function (req,res){

    Task.findById(req.params.task_id, function(err, task){
        if (err){ return res.send(err); }

        res.json(task.answers);
    });
})

router.route('/answers')

.get(function(req,res){

    Task.find(function(err, tasks){
        if (err){ return res.send(err); }

        res.json(tasks);
    });

})

router.route('/tasks/:task_id/answers/:answer_id')

.get(function (req,res){

    Task.findById(req.params.task_id, function(err, task){
        if (err){ return res.send(err); }
        if(!task.answers.id(req.params.answer_id)) { return res.json({ message: 'There is no answer with id ' + req.params.answer_id + ' in task ' + req.params.task_id }) };;

        res.json(task.answers.id(req.params.answer_id));
    });
})

.put(function(req,res){
    Task.findById(req.params.task_id, function(err, task){
        if (err){ return res.send(err); }
        if(!task.answers.id(req.params.answer_id)) { return res.json({ message: 'There is not answer with id ' + req.params.answer_id + ' in task ' + req.params.task_id }) };;
        task.answers.id(req.params.answer_id).user_id=req.body.user_id;
        task.answers.id(req.params.answer_id).questions_answers=req.body.answers;

        task.save(function(err){
            if (err) { res.send(err); }

            res.json({ message: 'Answer updated!' });
        });
    });
})

.delete(function(req, res){
    Task.findById(req.params.task_id, function(err, task){
        if (err){ return res.send(err); }
        
        //new
        if(!task.answers.id(req.params.task_id) && !task.answers_to_review.id(req.params.answer_id)) { return res.json({ message: 'There is not answer with id ' + req.params.answer_id + ' in task ' + req.params.task_id }) };;

        if(task.answers.id(req.params.answer_id)){
            task.answers.pull({'_id': req.params.answer_id});
        }
        if(task.answers_to_review.id(req.params.answer_id)) {
            task.answers_to_review.pull({'_id': req.params.answer_id});
            if(task.review_ids){
                Task.remove({_id:task.review_ids.task_id}, function(err, task){
                    if (err){ return res.send(err); }
                });
            }
        }
        //new

        task.save(function(err, updatedTask){
            if (err) { res.send(err); }
            res.json({ message: 'We have deleted the answer!'});
        });
    });

})

function createReviewTask(task, callback){

        //if(task.needs_review){
            newTask = new Task();

            var items =[];
            var answer_to_review = task.answers_to_review[task.answers_to_review.length-1].questions_answers;
            console.log(answer_to_review);

            for (var i = 0; i < task.items.length; i++) {
                var newItem = {};
                newItem.item_question = 'Is the answer to this question correct?';
                newItem.item_text = '_*Question*_\n' + task.items[i].item_question + '\n```' + task.items[i].item_text + '```\n_*Answer*_\n```' + answer_to_review[i].answer_text + ' ```';
                newItem.item_picture_url = task.items[i].item_picture_url ||  answer_to_review[i].answer_picture_url || "";
                newItem.item_options = ["Yes", "No", "I am not sure"];
                newItem.item_answer_type = 'option';
                items.push(newItem);
            }

            newTask.title = "Review Task: "+ task.title; 
            newTask.description = "We will show you a set of questions already answered. Please, indicate if they are properly answered. You don't need to know if the answer is correct, but you need to indicate if it makes sense. For example, if they are asking 'What is the color of this T-shirt' a correct answers can be 'blue' or 'red', but not 'elephant'."; 
            newTask.reward = 0;
            newTask.number_of_answers = 3;
            // What if more than one answer posted?
            newTask.flag_out_users = task.answers_to_review[task.answers_to_review.length-1].user_id || "";
            newTask.review_task = true;
            newTask.items = items,
            newTask.answer_type = "option";
            newTask.answers = [];
            newTask.review_ids = { 
                "task_id": task.id,
                "answer_id": task.answers_to_review[task.answers_to_review.length-1].id
            };
            newTask.save(function(err, updatedTask){
                if (err) { callback(err); }
                var response = { 
                    message: 'We have created a new answer! The id of the answer is ' + task.answers_to_review[task.answers_to_review.length-1].id + ". We have also created a task with id " + updatedTask.id + "to review this answer.",
                    answer_id: task.answers_to_review[task.answers_to_review.length-1].id,
                    task_id: updatedTask.id
                };
                callback(null, response);
            });

        //}

}

function updateReviews(task){

    Task.findById(task.review_ids.task_id, function(err, task_under_review){

        if (err){ return res.send(err); }

        var answer_under_review = task_under_review.answers_to_review.id(task.review_ids.answer_id);
        var answer_to_question = task.answers[task.answers.length-1];

        /*var questionsApproved = true;
        for (var i = 0; i < answer_to_question.questions_answers.length; i++) {
            console.log(answer_to_question.questions_answers[i])
            if (answer_to_question.questions_answers[i].answer_text !== 'Yes'){
                questionsApproved = false;
            }
        }*/

        if(task_under_review.answers_to_review.id(task.review_ids.answer_id)){
            task_under_review.answers_to_review.id(task.review_ids.answer_id).reviews.push(areAnswersCorrect(answer_to_question.questions_answers));
        }else{
            //task_under_review.answers_accepted.id(task.review_ids.answer_id).reviews.push(questionsApproved);
        }
        

        //task_under_review.save(function(err, updatedReviewedTask){
            //if (err) { return res.send(err); }

            if(task_under_review.answers_to_review.id(task.review_ids.answer_id)){
                var reviews = task_under_review.answers_to_review.id(task.review_ids.answer_id).reviews;
                var positiveReviews = 0;
                var negativeReviews = 0;
                for (var i = 0; i < reviews.length; i++) {
                    console.log(reviews[i]);
                    if(reviews[i]) { positiveReviews++ }
                    else { negativeReviews++ }
                }
                if (positiveReviews>1) {
                    newAnswer = {};
                    newAnswer.user_id = task_under_review.answers_to_review.id(task.review_ids.answer_id).user_id;
                    newAnswer.questions_answers = task_under_review.answers_to_review.id(task.review_ids.answer_id).questions_answers;
                    task_under_review.answers.push(newAnswer);
                    task_under_review.answers_accepted.push(task_under_review.answers_to_review.id(task.review_ids.answer_id));
                    task_under_review.answers_to_review.pull({'_id': task.review_ids.answer_id});
                }
                if (negativeReviews>1) {
                    newAnswer = {};
                    newAnswer.user_id = task_under_review.answers_to_review.id(task.review_ids.answer_id).user_id;
                    newAnswer.questions_answers = task_under_review.answers_to_review.id(task.review_ids.answer_id).questions_answers;
                    //task_under_review.answers_rejected.push(newAnswer);
                    task_under_review.answers_rejected.push(task_under_review.answers_to_review.id(task.review_ids.answer_id));
                    task_under_review.answers_to_review.pull({'_id': task.review_ids.answer_id});
                }

                task_under_review.save(function(err, taskReviewedUpdated){
                    if (err) { return res.send(err); }
                    console.log('We are going to send the webhook');
                    console.log(taskReviewedUpdated);
                    console.log(taskReviewedUpdated.answers[taskReviewedUpdated.answers.length-1]);
                    if(positiveReviews>1) { sendAnswerNotification(taskReviewedUpdated.webhook_url, taskReviewedUpdated.answers[taskReviewedUpdated.answers.length-1]); }
                });
            }

        //});
    })
}

function sendAnswerNotification(webhook_url, answer){
    console.log("Send webhook");
    var http = require("http");
    console.log(webhook_url);
    var options = {
      hostname: webhook_url.host,
      port: webhook_url.port || '',
      path: webhook_url.path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
    };
    console.log(options);
    var request = http.request(options, function(res) {
      console.log('Status: ' + res.statusCode);
      console.log('Headers: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (body) {
        console.log('Body: ' + body);
      });
    });
    request.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    // write data to request body
    request.write(JSON.stringify(answer));
    request.end();
}

function areAnswersCorrect(answers){
        for (var i = 0; i < answers.length; i++) {
            console.log(answers[i])
            if (answers[i].answer_text !== 'Yes'){
                return false;
            }
        }
    return true;
}

module.exports = router;