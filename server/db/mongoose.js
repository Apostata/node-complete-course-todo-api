const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //seting mongoose to use promises
mongoose.connect(process.env.MONGODB_URI);

module.exports ={
	mongoose
};

//process.NODE_ENV ==='production' - in heroku, 'development' -localy, 'test' in Mocha 