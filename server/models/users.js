const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ =require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type:String,
		required: true,
		minlength: 1,
		trim: true,
		unique:true,
		validate:{
			validator:validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password:{
		type:String,
		require:true,
		minlength:6
	},
	tokens:[{
		access:{
			type:String,
			require:true
		},
		token:{
			type:String,
			require:true
		}
	}]
});

UserSchema.methods.toJSON = function(){
	var user = this;
	userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({ _id:user._id.toHexString(), access}, process.env.JWT_SECRET);	

	user.tokens.push({access, token});

	return user.save().then( //return the promise
		()=>{
			return token; //return the token
		}
	);
};

UserSchema.methods.removeToken = function(token){
	var user = this;

	return user.update({
		$pull:{ //remove do array todos as instancias que sejam igual ao filtro, no caso tokens.token = variavel token
			tokens:{
				token // token: token
			}
		}
	})
};

UserSchema.statics.findByToken =function(token){
	var User = this;
	var decoded;

	try{
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	}
	catch(e){
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token':token,
		'tokens.access': 'auth'
	})
};

UserSchema.statics.findByCredentials =function(email, password){
	var User = this;

	return User.findOne({email}).then((user)=>{
		if(!user){
			return Promise.reject();
		}

		return new Promise((resolve, reject) => { //retorn reject se não é iqual ou resolve(user) se igual
			bcrypt.compare(password, user.password, (err, res)=>{
				if(!res){
					reject();
				}

				resolve(user);
			});
		});	
	})
};

UserSchema.pre('save',function(next){
	var user = this;

	if(user.isModified('password')){
		bcrypt.genSalt(10, (err, salt)=>{
			bcrypt.hash(user.password, salt, (err, hash)=>{
				user.password = hash;
				next();
			});
		});
	}
	else{
		next();
	}
});

var User = mongoose.model('User', UserSchema);

/*validator:(value)=>{
	return validator.isEmail(value);//required validator used here
},*/
module.exports = {
	User
};