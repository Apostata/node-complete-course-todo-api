const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

beforeEach((done)=>{
	Todo.remove({}).then(()=> done());//remove todos todos
});

describe('POST/Todos', ()=>{
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
				console.log(JSON.stringify(res.body, undefined, 2));
			})
			.end((err, res)=>{
				if(err){
					return done(err);
				}

				//else
				Todo.find().then(//busca no banco com o metodo find do moongose se add 1
					(todos)=>{
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					}
				).catch((e)=> done(e));
			});
	});

	it('shold not crate todo with invalid data', (done)=>{
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
						expect(todos.length).toBe(0);
						done();
					}
				).catch((e)=> done());
			});
	});
});