const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	//se tiver erro o return previne de mostrar o log abaixo
	console.log('connected to MongoDB server');

	/*db.collection('ToDos').insertOne(
		{
			text:'Something to do',
			completed:false
		},
		(err, result)=>{
			if(err){
				return console.log('Unable to insert ToDo', err)
			}

			console.log(JSON.stringify(result.ops, undefined,2));
		}
	);*/

	db.collection('Users').insertOne(
		{
			name:'Rene Souza',
			age:32,
			location:'Rua Danaides, 53, São Paulo, SP, Brasil'
		},
		(err, result)=>{
			if(err){
				return console.log('Unable to insert User', err);
			}
			//console.log(JSON.stringify(result.ops, undefined, 2));
			console.log(result.ops[0]._id.getTimestamp());
		}
	);

	db.close();
});