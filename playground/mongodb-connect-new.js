//const MongoClient = require('mongodb').MongoClient;
const{MongoClient, ObjectID} = require('mongodb');

/*
var obj = new ObjectID();
console.log(obj);
*/

//destructuring ES6
/*var user = {name:"Rene", age:25};
var {name} = user;
console.log(name);
*/
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	//se tiver erro o return previne de mostrar o log abaixo
	console.log('connected to MongoDB server');

	db.close();
});