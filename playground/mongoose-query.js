const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

//var id = '58338d5480c20c0610f918a6';
/*var id = '58338d5480c20c0610f918a66';
if(!ObjectID.isValid(id)){
	console.log('Id not valid!');
}

Todo.find({//select all
	_id: id
}).then(
	(todos)=>{
		console.log('Todos', todos)
	}
);

Todo.findOne({//select one
	_id: id
}).then(
	(todo)=>{
		console.log('Todo', todo)
	}
);

Todo.findById(id).then(
	(todo)=>{
		if(!todo){
			return console.log('Id not found');
		}
		console.log('Todo By ID', todo)
	}
).catch((e)=>{
	console.log(e)
});*/

//user findbyid
//hadler found or not 

var id = '583302f35447ae31c4f97e17';

if(ObjectID.isValid(id)){
	console.log('valid id...Proceeding!');
}
else{
	console.log('Not a valid Id. Terminating!');
}

User.findById(id).then(
	(user)=>{
		if(!user){
			return console.log('Nothing found!');
		}
		console.log(user);
	}
).catch(
	(e)=>{
		console.log(e);
	}
);