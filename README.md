# JackBot API

This is the API for Jackbot. It allows the requesters to introduce tasks into the platform, and the Slack Bot to extract the task in order to show them to the workers.

## Deploy locally

To deploy locally from your console:
1. Clone the API: `git clone https://github.com/lidiafgarces/JackBot-API`
2. Get inside the folder: `cd JackBot-API`
3. Install dependencies: `npm install`
4. Launch the app: `MONGODB_URI=<Your MongoDB URI (for example, in mLab)> node server.js`

## Deploy on Heroku

You can deploy directly to Heroku with the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Instructions

**_You can find the API in: https://serene-sea-69467.herokuapp.com/api_**

The API has following endpoints:

### GET /tasks

It retrieves the full list of tasks from the database.

### GET /tasks/todo

It retrieves the list of tasks that do not have a enough answers from the database.

### DELETE /tasks/deleteAll

It retrieves the list of tasks that do not have a enough answers from the database.E

### GET /tasks/:task_id

It retrieves the task with the correspondly ‘task_id’.

### POST /tasks

It adds a task to the database.

You should provide a JSON with the following fields

<table>
  <tr>
    <td>title: String,
description: String,
reward: Number,
number_of_answers: Number,
needs_review: Boolean,
flag_out_users: [String],
location: {
    coordinate_x: String,
    coordinate_y: String,
},
webhook_url: {
    	host: String,
    	port: String,
    	path: String,
    },

items: [{
    	item_question: String,
    	item_text: String,
    	item_picture_url: String,
    	item_options: [String],
    	item_answer_type: String,
}]
</td>
    <td>title: mandatory
description: mandatory
reward: mandatory
number_of_answers: optional,
needs_review: optional,
flag_out_users: optional,
location: optional



webhook_url: {
    	host: optional,
    	port: optional,
    	path: optional,
    },

items: mandatory
    item_question: mandatory
    item_text: optional
    item_picture_url: optional
    item_options: optional
    item_answer_type: mandatory     	    	-(text, picture, option)</td>
  </tr>
</table>


* You have to provide a title (‘title’), a description (‘description’) and reward (‘reward’) for the task.

* Optionally, you can add 

    * a location (‘location’)

    * the minimum number of answers that you want (‘number_of_answers’) 

    * if the task needs to be reviewed (‘needs_review’)

    * a url to which send a notification (POST request) when your task receives an answer

        * **THE HOST SHOULD BE WITHOUT ‘http://’ or ‘https://’**

    * the users that you do not want to answer the question (‘flag_out_users’)

* A task can have several item. Each item poses a question to the worker. For each item:

    * You have to provide 

        * A question (‘item_question’)

        * The type of answer expected (‘item_answer_type’**)**. This field accept the values

            * ‘text’: when the answer expected is a free text

            * ‘picture’: when the answer expected is a picture

            * ‘option’: when the answer expected is one of the provided options

    * You can optionally provide:

        * ‘item_text’: when you need to add a text to the question.

        * ‘item_picture’: when you need to add a picture to the question.

        * ‘item_options’: when you want to give a pool of answers for the question.

Successful requests answer with the following JSON:

<table>
  <tr>
    <td>message: String,
task_id: String</td>
  </tr>
</table>


Example:

<table>
  <tr>
    <td>{
    "title": "Example",
    "description": "This is an example of an amazing task",
    "reward": 5,
    "location": {
    	"coordinate_x": 52.007328,
    	"coordinate_y": 4.3653533
    },
    "items": [
    	{
    	    "item_question": "What is the sentiment of this tweet?",
    	    "item_text": "Too much work today! Willing to arrive home #TUDelft",
    	    "item_options": ["positive", "neutral", "negative"],
                "item_answer_type": "option"
    	},
    	{
    	    "item_question": "What is the sentiment of this tweet?",
    	    "item_text": "Sunny day at #TUDelft!",
    	    "item_options": ["positive", "neutral", "negative"]	,
                "item_answer_type": "option"
    	}
    ],
   
}
</td>
  </tr>
  <tr>
    <td>{
  "message": "We have created a new task! The id for the task is    	  
	  	  58d3ee0844a5284dea7b7fe6",
  "task_id": "58d3ee0844a5284dea7b7fe6"
}
</td>
  </tr>
</table>


## PUT /tasks/:task_id

It edits the task corresponding to ‘task_id’. Same JSON as POST /tasks**.**

## DELETE /tasks/:task_id

It deletes the task corresponding to ‘task_id’.

## GET /tasks/:task_id/answers

It retrieves all answers for the task corresponding to ‘task_id’.

## GET /answers

It retrieves all answers with its associated task.

## GET /tasks/:task_id/answers/:answer_id**

It retrieves the answer with the correspondly ‘answer_id’.

## POST /tasks/:task_id/answers**

It adds an answer to the database.

You should provide a JSON with the following fields:

<table>
  <tr>
    <td>user_id: String,
task_id: String,
answer: [{
    	answer_text: String,
    	answer_picture_url: String,
}]
</td>
    <td>user_id: optional,
task_id: mandatory,
answers: mandatory
    	answer_text: optional,
    	answer_picture_url: optional,</td>
  </tr>
</table>


* ‘user_id’: the id of the user that completed this task. This is an optional field.

* ‘task_id’: the id of the task to which the answer belongs. This is a mandatory parameter.

* ‘answers’: answers to each of the items of the task. This field cannot be empty.

    * ‘answer_text’: the text provided as answer. This is an optional field.

    * answer_picture_url: the url of the picture provided as answer. This is an optional field.

Successful requests answer with the following JSON:

<table>
  <tr>
    <td>message: String,
answer_id: String</td>
  </tr>
</table>


Example:

<table>
  <tr>
    <td>{
    "task_id": "58d393d08378af349b49c859",
    "answers": [
    {
    	"answer_text": "negative"
    },
    {
    	"answer_text": "neutral"
    }]
}
</td>
  </tr>
  <tr>
    <td>{
  "message": "We have created a new answer! The id of the answer is     	
    	    	58d3f0b65d9d9a4ea7464136",
  "answer_id": "58d3f0b65d9d9a4ea7464136"
}
</td>
  </tr>
</table>


## PUT/tasks/:task_id/answers/:task_id

It edits the answer corresponding to ‘answer_id’. Same JSON as POST /answers**.**

## DELETE /tasks/:task_id/answers/:answer_id

It deletes the answer corresponding to ‘answer_id’.
