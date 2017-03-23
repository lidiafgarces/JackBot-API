// Set up express and include our Task model
var express = require('express');
var Task = require('../models/task');
var Answer = require('../models/answer');

var router = express.Router();

router.route('/tasks')

.post(function(req,res){

    var task = new Task();

    console.log(req.body);
  
    task.title = req.body.title; 
    task.description = req.body.description; 
    task.reward = req.body.reward;
    task.location = req.body.location;
    task.items = req.body.items;
    task.answer_type = req.body.answer_type;

    var mandatoryFilled = task.title && task.description && task.reward && (task.items.length>0);

    for(itemIdx in req.body.items){
        if (!req.body.items[itemIdx].item_question) mandatoryFilled=false;
        if (!req.body.items[itemIdx].item_answer_type) mandatoryFilled=false;
    }

    //task.friends.push(req.body.friends);
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
            console.log(task.title + '\n' + task.description + '\n' + task.reward + '\n' + task.items + '\n' + task.items.item_question + '\n' + task.items.item_answer_type);
        }
    }

})

.get(function(req,res){

    Task.find(function(err, tasks){
        if (err){ res.send(err); }

        res.json(tasks);
    });

})

router.route('/tasks/:task_id')

.get(function (req,res){

    Task.findById(req.params.task_id, function(err, task){
        if (err){ res.send(err); }

        res.json(task);
    });
})

.put(function(req,res){
    Task.findById(req.params.task_id, function(err, task){
        if (err){ res.send(err); }

        task.title = req.body.title; 
        task.description = req.body.description; 
        task.reward = req.body.reward;
        task.location = req.body.location;
        task.items = req.body.items;
        task.answer_type = req.body.answer_type;

        task.save(function(err){
            if (err) { res.send(err); }

            res.json({ message: 'Task Updated!' });
        });
    });
})

.delete(function(req, res){
    Task.remove({_id:req.params.task_id}, function(err, task){
        if (err){ res.send(err); }

        res.json({ message: 'Task successfully removed!' });
    });
})

// Routes for a specific task, ending in /tasks/:task_id
router.route('/tasks/:task_id/answers')

.get(function (req,res){

    Answer.find({task_id: req.params.task_id}, function(err, answers){
        if (err){ res.send(err); }

        res.json(answers);
    });
})

router.route('/answers')

.post(function(req,res){

    var answer = new Answer();

    console.log(req.body);
  
    // Set the task name, and add our friend to the friends array 
    answer.user_id = req.body.user_id; 
    answer.task_id = req.body.task_id; 
    answer.answers = req.body.answers; 

    //task = req.body;

    //task.friends.push(req.body.friends); 

    if(answer.task_id && (answer.answers.length>0)){
        answer.save(function(err, answer){
            if (err) { res.send(err); }
            console.log('\n');
            console.log(answer.id);
            res.json({ message: 'We have created a new answer! The id of the answer is ' + answer.id, answer_id: answer.id});
        });
    }else{
        res.status('400').send('Bad Request. A mandatory field is empty.');
    }
})

.get(function(req,res){

    Answer.find(function(err, answers){
        if (err){ res.send(err); }

        res.json(answers);
    });

})

router.route('/answers/:answer_id')

.get(function (req,res){

    Answer.findById(req.params.answer_id, function(err, answer){
        if (err){ res.send(err); }

        res.json(answer);
    });
})

.put(function(req,res){
    Answer.findById(req.params.answer_id, function(err, answer){
        if (err){ res.send(err); }

        answer.user_id = req.body.user_id; 
        answer.task_id = req.body.task_id; 
        answer.answers = req.body.answers; 

        answer.save(function(err){
            if (err) { res.send(err); }

            res.json({ message: 'Answer Updated!' });
        });
    });
})

.delete(function(req, res){
    Answer.remove({_id:req.params.answer_id}, function(err, answer){
        if (err){ res.send(err); }

        res.json({ message: 'Successfully removed!' });
    });
})

module.exports = router;