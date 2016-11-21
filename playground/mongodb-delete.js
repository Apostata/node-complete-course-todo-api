//const MongoClient = require('mongodb').MongoClient;
const{MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	//se tiver erro o return previne de mostrar o log abaixo
	console.log('connected to MongoDB server');

	//deleteMany
	/*db.collection('ToDos').deleteMany({text:'Eat lunch'}).then((result)=>{
		console.log(result);
	})*/

	//deleteOne
	/*db.collection('ToDos').deleteOne({text:'Eat lunch'}).then((result)=>{
		console.log(result);
	});*/

	//findOneAndDelete
	/*db.collection('ToDos').findOneAndDelete({completed:false}).then((result)=>{
		console.log(result);
	});*/

	//chalenge delete repeted names and another one by id

	/*db.collection('Users').deleteMany({name:'Rene Souza'}).then((result)=>{
		console.log(result);
	}); -- OK --*/ 

	/*db.collection('Users').findOneAndDelete({_id:new ObjectID('582fb93ec8793b3a0cb613a1')}).then((result)=>{
		console.log(result);
	}); -- OK --*/
	//db.close();
});