const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

//Todo.remove() não pode ser vazio
//Todo.remove({}) remove tudo
//Todo.findOneAndRemove() remove um retornando o resultado
//Todo.findByIdAndRemove({}) remove procurando pelo if retornando o resultado


/*
Todo.remove({}).then(
	(result)=>{
		console.log(result);
	}
);
*/

/*
Todo.findOneAndRemove({text:'Algum todo qualquer'}).then(
	(todo)=>{
		console.log(todo);
	}
);
*/


Todo.findByIdAndRemove('58371a9cca532bcaa0201082').then( //return sucess call even if no todo was deleted
	(todo)=>{
		console.log(todo);
	}
);
