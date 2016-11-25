const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');



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

beforeEach((done)=>{
	Todo.remove({}).then(()=>{//remove todos todos
		return Todo.insertMany(todos);
	}).then(()=> done());
});

describe('POST/todos', ()=>{
	it('Should create a new todo',(done)=>{
		var text = 'Test todo text';

		request(app)
			.post('/todos')//metodo
			.send({//parametros enviados
				text
			})
			.expect(200)//verifica o status code
			.expect((res)=>{//verifica resposta
				expect(res.body.text).toBe(text);
				//console.log(JSON.stringify(res.body, undefined, 2));
			})
			.end((err, res)=>{
				if(err){
					return done(err);
				}

				//else
				Todo.find({text}).then(//busca no banco com o metodo find do moongose se add 1
					(todos)=>{
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					}
				).catch((e)=> done(e));
			});
	});

	it('shold not create todo with invalid data', (done)=>{
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res)=>{
				if(err){
					return done(err);
				}

				Todo.find().then(
					(todos)=>{
						expect(todos.length).toBe(2);
						done();
					}
				).catch((e)=> done());
			});
	});
});

describe('GET/todos', ()=>{
	it('Should list all todos',(done)=>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res)=>{
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET/todos/:id', ()=>{
	it('Should return todo doc', (done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res)=>{
			//console	.log(res.body);
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('Should return 404 if todo not found', (done)=>{
		var hexId = new ObjectID().toHexString();// cria um novo que não estará no banco de dados, obviamente
		request(app)
		.get(`/todos/${hexId}`)
		.expect(400)
		.end(done);
	});

	it('Should return 404 for non objet ids', (done)=>{
		request(app)
		.get(`/todos/111`)
		.expect(400)
		.end(done);
	});
});


describe('DELETE/todos/:id', ()=>{
	it('Should remove a todo',(done)=>{
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo._id).toBe(hexId)
			})
			.end((err, res)=>{
				if(err){
					return done(err);
				}

				Todo.findById(hexId).then(
					(todo)=>{
						expect(null).toNotExist();
						done();
					}
				).catch((e)=> done());
			});
	});

	it('Shold return 404 if todo not find',(done)=>{
		var hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('Should return 404 if ObjectID is invalid',(done)=>{
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done);
	});
});

describe('PATCH/todos:id', ()=>{
	it('Should update the todo', (done)=>{
		var hexId = todos[0]._id.toHexString();
		var text = 'Update todo 1';
		var completed = true;

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				text,
				completed
			})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('Should clear completedAt when todo is not completed', (done)=>{
		var hexId = todos[1]._id.toHexString();
		var text = 'Update todo 2';
		var completed = false;

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				text,
				completed
			})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist()
			})
			.end(done);
	});

	it('Shold return 400 if todo not find',(done)=>{
		var hexId = new ObjectID().toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.expect(400)
			.end(done);
	});

	it('Should return 404 if ObjectID is invalid',(done)=>{
		request(app)
			.patch('/todos/123')
			.expect(404)
			.end(done);
	});
});
