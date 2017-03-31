// Set up express and include our Task model
var express = require('express');
var Task = require('../models/task');
var Answer = require('../models/answer');

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
    task.location = req.body.location;
    task.items = req.body.items;
    task.answer_type = req.body.answer_type;
    task.answers = [];

    var mandatoryFilled = task.title && task.description && task.reward && (task.items.length>0);

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

    Task.find({ $where : "this.answers.length >= this.number_of_answers" }).select('-answers').exec(function(err, tasks){
        if (err){ return res.send(err); }

        res.json(tasks);
    });

})

router.route('/tasks/:task_id')

.get(function (req,res){

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

.get(function (req,res){

    Task.find({task_id: req.params.task_id}, function(err, answers){
        if (err){ return res.send(err); }

        res.json(task.answers);
    });
})

router.route('/answers')

.post(function(req,res){

    console.log(req.body);

    if(req.body.task_id && (req.body.answers.length>0)){
        Task.findById(req.body.task_id, function(err, task){
            if (err){ return res.send(err); }
            console.log(task);

            var answer = {};

            answer.user_id = req.body.user_id; 
            answer.questions_answers = req.body.answers;

            task.answers.push(answer);

            task.save(function(err, updatedTask){
                if (err) { res.send(err); }
                res.json({ message: 'We have created a new answer! The id of the answer is ' + task.answers[task.answers.length-1].id, answer_id: task.answers[task.answers.length-1].id});
            });
        });
    }else{
        res.status('400').send('Bad Request. A mandatory field is empty.');
    }
})

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
        if(!task.answers.id(req.params.answer_id)) { return res.json({ message: 'There is not answer with id ' + req.params.answer_id + ' in task ' + req.params.task_id }) };;

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
        if(!task.answers.id(req.params.answer_id)) { return res.json({ message: 'There is not answer with id ' + req.params.answer_id + ' in task ' + req.params.task_id }) };;

        task.answers.pull({'_id': req.params.answer_id});

        task.save(function(err, updatedTask){
            if (err) { res.send(err); }
            res.json({ message: 'We have deleted the answer!'});
        });
    });

})

module.exports = router;