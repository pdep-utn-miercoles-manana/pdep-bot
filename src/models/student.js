const _ = require('lodash');
const config = require('config');
const Mongoose = require('../helpers/mongoose');

const Student = Mongoose.Schema({
  email: { type: String, unique: true },
  isVerified: Boolean,
  firstName: String,
  lastName: String,
});

Student.methods.fullName = function () {
  return _.startCase(_.toLower(`${this.firstName} ${this.lastName}`));
}

Student.methods.verify = function () {
  this.isVerified = true;
  return this.save();
};

Student.statics.MAIL_VERIFIED_ROLE_NAME = config.discord.verifiedMailRoleName;

module.exports = Mongoose.model("Student", Student);