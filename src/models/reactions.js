const Mongoose = require('mongoose');

const Reaction = Mongoose.Schema({
	text: String,
	emoji: String,
	enable: Boolean,
	roleName: String,
	channel: String,
	toPublish: Boolean
});

module.exports = Mongoose.model("Reaction", Reaction);