const express = require('express');
const bodyParser = require('body-parser');//take body and convert to an object

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json()); //body parser middleware

app.post('/todos',(req, res)=>{
	//console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});
	todo.save().then(
		(doc)=>{
			res.send(doc);
		},
		(e)=>{
			res.status(400).send(e);
		}
	);
});

app.get('/todos', (req, res)=>{
	Todo.find().then(
		(todos)=>{
			res.send({
				todos
			});
		},
		
		(e)=>{
			res.status(400).send(e);
		}
	);
});

app.listen(port, ()=>{
	console.log(`Server runing at port ${port}`);
});

module.exports = {
	app
};