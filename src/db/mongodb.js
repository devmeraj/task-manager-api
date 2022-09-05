const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_URL).catch(err => {if(err) throw err;});

mongoose.connection.on('connected', (e)=> console.log('connection to database is stablished'));
mongoose.connection.on('reconnected', (e)=> console.log('connection to database is stablished again'));
mongoose.connection.on('disconnected', (e)=> console.log('connection to database ended'));