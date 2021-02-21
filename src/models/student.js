const _ = require('lodash');
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
  this.save();
};

module.exports = Mongoose.model("Student", Student);