const mongoose = require('mongoose');

const reaction = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	text: String,
	emoji: String,
	enable: Boolean,
	roleName: String,
	channel: String,
	toPublish: Boolean
});

module.exports = mongoose.model("Reaction", reaction)