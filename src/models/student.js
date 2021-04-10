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
  this.validateNamesLegnth()
  return _.startCase(_.toLower(`${this.firstName} ${this.lastName}`));
}

Student.methods.verify = function () {
  this.isVerified = true;
  return this.save();
};

Student.methods.validateNamesLegnth = function(){
  var fullName = `${this.firstName} ${this.lastName}`;
  if (fullName.length >= 32) {
    let lastNames = this.lastName.split(" ");
    if (lastNames.length !== 1) {
      lastNames.pop();
      this.lastName = lastNames.join(" ").trim();
      this.validateNamesLegnth();
    } else {
      let firstNames = this.firstName.split(" ");
      firstNames.pop();
      this.firstName = firstNames.join(" ").trim();
      this.validateNamesLegnth();
    }
  }
}

Student.statics.MAIL_VERIFIED_ROLE_NAME = config.discord.verifiedMailRoleName;

module.exports = Mongoose.model("Student", Student);