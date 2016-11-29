require('./config/config');

const _= require('lodash');
const express = require('express');
const bodyParser = require('body-parser');//take body and convert to an object

const bcrypt = require('bcryptjs');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

var port = process.env.PORT;

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

app.get('/todos/:id', (req, res)=>{
	//valid id
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(400).send();
	}

	Todo.findById(id).then(
		(todo)=>{
			if(!todo){
				return res.status(400).send();
			}
			
			res.status(200).send({todo});
		}
	).catch(
		(e)=>{
			res.status(400).send(e);
		}
	);
});

app.delete('/todos/:id', (req, res)=>{
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}
	Todo.findByIdAndRemove(id).then(
		(todo)=>{
			if(!todo){
				return res.status(404).send();
			}

			res.status(200).send({todo});
		}
	).catch(
		(e)=>{
			res.status(404).send(e)
		}
	);
});

app.patch('/todos/:id', (req, res)=>{
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);  //reason to require lodash, usuário só poderá atualizar "text" e "completed"
	
	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}
	else{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then(
		(todo)=>{
			if(!todo){
				return res.status(400).send();
			}

			res.send({todo});
		}		
	).catch(
		(e)=>{
			res.status(400).send();
		}
	)
});

app.post('/users', (req, res)=>{
	var body = _.pick(req.body, ['email', 'password']);  //reason to require lodash, usuário só poderá atualizar "text" e "completed"
	var user = new User(body);

	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth', token).send(user);
	})
	.catch((e)=>{
		res.status(400).send(e);
	})
});

app.listen(port, ()=>{
	console.log(`Server runing at port ${port}`);
});

app.get('/users/me', authenticate, (req, res)=>{
	res.send(req.user);
});

app.post('/users/login', (req, res)=>{
	var body = _.pick(req.body, ['email', 'password']);
	User.findByCredentials(body.email, body.password).then((user)=>{ // statics cria uma função que é istanciada com o próprio modelo como uma Classe
		user.generateAuthToken().then((token)=>{ // method cria uma função que é instanciada por um objeto
			res.header('x-auth', token).send(user);
		});

	}).catch((e)=>{
		res.status(400).send();
	})
});

app.delete('/users/me/token', authenticate, (req, res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	},()=>{
		res.status(400).send();
	})
});

module.exports = {
	app
};