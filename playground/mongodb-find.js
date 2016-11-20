//const MongoClient = require('mongodb').MongoClient;
const{MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	//se tiver erro o return previne de mostrar o log abaixo
	console.log('connected to MongoDB server');

	db.collection('ToDos').find().toArray().then((docs)=>{
		console.log('ToDos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err)=>{
		console.log('Unable to Fetch ToDos', err);
	})

	//db.close();
});