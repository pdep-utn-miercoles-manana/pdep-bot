const config = require('config');
const Promise = require('bluebird');
const Mongoose = require('mongoose');

Mongoose.Promise = Promise;

module.exports = Mongoose;

module.exports.logEvents = function () {
  Mongoose.connection.once('open', function() {
    console.info('MongoDB event open');
    console.debug('MongoDB connected');

    Mongoose.connection.on('connected', function() {
      console.info('MongoDB event connected');
    });

    Mongoose.connection.on('disconnected', function() {
      console.warn('MongoDB event disconnected');
    });

    Mongoose.connection.on('reconnected', function() {
      console.info('MongoDB event reconnected');
    });

    Mongoose.connection.on('error', function(err) {
      console.error('MongoDB event error: ' + err);
    });
  });
}

module.exports.connectDB = function () {
  return Mongoose.connect(config.mongo.connectionString, config.mongo.connectionOptions);
}

module.exports.disconnectDB = function () {
  return Mongoose.connection.close();
}
