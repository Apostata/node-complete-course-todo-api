//const MongoClient = require('mongodb').MongoClient;
const{MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	//se tiver erro o return previne de mostrar o log abaixo
	console.log('connected to MongoDB server');

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5832595bf2ce7c5774d418b9')
	},
	{// o oque atualizar
		$set:{
			name:'Rene',
		},
		$inc:{
			age:8
		}
	},

	{//options
		returnOriginal:false
	}).then((result)=>{
		console.log(result);
	})
	//db.close();
});