// Set up express and include our Task model
var express = require('express');
var Task = require('../models/task');
var Answer = require('../models/answer');

// Get an instance of the express router
var router = express.Router();



// Our first set of routes, those that end with /tasks
router.route('/tasks')

/*
// When we POST to the /tasks route we want to create 
// a new task from the data sent in the request. We're 
// going to assume that our new tasks come packaged with 
// a friend (a la MySpace Tom), though we could easily 
// initialize this to an empty array as well.
*/
.post(function(req,res){

    var task = new Task();

    console.log(req.body);
  
    // Set the task name, and add our friend to the friends array 
    task.title = req.body.title; 
    task.description = req.body.description; 
    task.reward = req.body.reward;
    task.estimated_time = req.body.estimated_time;
    task.location = req.body.location;
    task.items = req.body.items;
    task.answer_type = req.body.answer_type;

    //task = req.body;

    //task.friends.push(req.body.friends); 

    // Save the task to the database
    // If we don't get any errors respond with a success message
    task.save(function(err, task){
        if (err) { res.send(err); }

        res.json({ message: 'We have created a new task! The id for the task is ' + task.id});
    });
})

/* 
// When we make a GET request to /tasks we want 
// to return all of our tasks in the response as 
// a JSON object.
//
// We'll use mongoose to find our task documents, 
// and if there are no errors, we'll send a response 
// containing our tasks as JSON
*/
.get(function(req,res){

    Task.find(function(err, tasks){
        if (err){ res.send(err); }

        res.json(tasks);
    });

})



// Routes for a specific task, ending in /tasks/:task_id
router.route('/tasks/:task_id')

/*
// When we make a GET request for a specific task,
// we want to return that task as a JSON object.

// We'll use mongoose to find our task by their id, 
// and if there are no errors, we'll send a response 
// containing our task data as JSON

// As a side note, you may have noticed that we didn't
// create a task_id parameter in our schema, this parameter
// is automatically uniquely assigned by MongoDB. We can use 
// our own unique keys if we so choose.
*/
.get(function (req,res){

    Task.findById(req.params.task_id, function(err, task){
        if (err){ res.send(err); }

        res.json(task);
    });
})

/*
// When we make a PUT request we want to update 
// the task with the specified id using the data 
// in the request, if there are no errors we'll 
// respond with a success message.
*/
.put(function(req,res){
    Task.findById(req.params.task_id, function(err, task){
        if (err){ res.send(err); }

        task.title = req.body.title; 
        task.description = req.body.description; 
        task.reward = req.body.reward;
        task.estimated_time = req.body.estimated_time;
        task.location = req.body.location;
        task.items = req.body.items;
        task.answer_type = req.body.answer_type;

        task.save(function(err){
            if (err) { res.send(err); }

            res.json({ message: 'Task Updated!' });
        });
    });
})

/*
// When we make a DELETE request we want to 
// remove the task with the specified id, if 
// there are no errors we'll again respond 
// with a success message
*/
.delete(function(req, res){
    Task.remove({_id:req.params.task_id}, function(err, task){
        if (err){ res.send(err); }

        res.json({ message: 'Successfully removed!' });
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


// Our first second of routes, those that end with /answers
router.route('/answers')

/*
// When we POST to the /tasks route we want to create 
// a new task from the data sent in the request. We're 
// going to assume that our new tasks come packaged with 
// a friend (a la MySpace Tom), though we could easily 
// initialize this to an empty array as well.
*/
.post(function(req,res){

    var answer = new Answer();

    console.log(req.body);
  
    // Set the task name, and add our friend to the friends array 
    answer.user_id = req.body.user_id; 
    answer.task_id = req.body.task_id; 
    answer.answers = req.body.answers; 

    //task = req.body;

    //task.friends.push(req.body.friends); 

    // Save the task to the database
    // If we don't get any errors respond with a success message
    answer.save(function(err, answer){
        if (err) { res.send(err); }
        console.log('\n');
        console.log(answer.id);
        res.json({ message: 'We have created a new answer! The id of the answer is ' + answer.id});
    });
})

/* 
// When we make a GET request to /tasks we want 
// to return all of our tasks in the response as 
// a JSON object.
//
// We'll use mongoose to find our task documents, 
// and if there are no errors, we'll send a response 
// containing our tasks as JSON
*/
.get(function(req,res){

    Answer.find(function(err, answers){
        if (err){ res.send(err); }

        res.json(answers);
    });

})

// Routes for a specific task, ending in /tasks/:task_id
router.route('/answers/:answer_id')

/*
// When we make a GET request for a specific task,
// we want to return that task as a JSON object.

// We'll use mongoose to find our task by their id, 
// and if there are no errors, we'll send a response 
// containing our task data as JSON

// As a side note, you may have noticed that we didn't
// create a task_id parameter in our schema, this parameter
// is automatically uniquely assigned by MongoDB. We can use 
// our own unique keys if we so choose.
*/
.get(function (req,res){

    Answer.findById(req.params.answer_id, function(err, answer){
        if (err){ res.send(err); }

        res.json(answer);
    });
})

/*
// When we make a PUT request we want to update 
// the answer with the specified id using the data 
// in the request, if there are no errors we'll 
// respond with a success message.
*/
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

/*
// When we make a DELETE request we want to 
// remove the answer with the specified id, if 
// there are no errors we'll again respond 
// with a success message
*/
.delete(function(req, res){
    Answer.remove({_id:req.params.answer_id}, function(err, answer){
        if (err){ res.send(err); }

        res.json({ message: 'Successfully removed!' });
    });
})

module.exports = router;