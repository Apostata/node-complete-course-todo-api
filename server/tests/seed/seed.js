const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/users');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
	{
		_id: userOneId,
		email:'rene@example.com',
		password:'userOnePass',
		tokens:[
			{
				access:'auth',
				token: jwt.sign({_id:userOneId, access:'auth'}, 'abc123').toString()
			}
		]
	},
	{
		_id:userTwoId,
		email:'erica@exemple.com',
		password:'userTwoPass'
	}
]

var todos =[
	{
		_id:new ObjectID(),
		text:"first"
	},
	{
		_id:new ObjectID(),
		text:"second",
		completed:true,
		completedAt:333
	}
];

const populateTodos = (done)=>{
	Todo.remove({}).then(()=>{//remove todos todos
		return Todo.insertMany(todos);
	}).then(()=> done());
};


const populateUsers = (done)=>{
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(()=>done());
};

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers
}