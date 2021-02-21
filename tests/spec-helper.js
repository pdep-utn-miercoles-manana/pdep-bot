_ = require('lodash');
chai = require('chai');
sinon = require('sinon');

chai.use(require('sinon-chai'))
chai.use(require("chai-as-promised"));

expect = chai.expect;

spec = (callback) => it('.', callback);
requireSrc = (relativePath) => require(path.resolve(__dirname, '..', 'src', relativePath));

const path = require('path');
const Mongoose = requireSrc('./helpers/mongoose');

before(Mongoose.connectDB);
after(Mongoose.disconnectDB);

suite = function (message, callback) {

  let mocks = {};

  afterEach(() => {
    _.forIn(mocks, (mock) => {
      mock.verify && mock.verify();
      mock.restore && mock.restore();
    });
  });

  describe(message, function () {
    callback.bind(this)(mocks);
  });

}