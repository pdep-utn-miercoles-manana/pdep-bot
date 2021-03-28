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

  beforeEach(() => Mongoose.connection.db.dropDatabase());

  afterEach(() => {
    _.forIn(mocks, (mock) => {
      mock.verify && mock.verify();
      mock.restore && mock.restore();
    });
  });

  afterEach(() => Mongoose.connection.db.dropDatabase());

  describe(message, function () {
    callback.bind(this)(mocks);
  });

}