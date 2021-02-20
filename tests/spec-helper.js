const path = require('path');

_ = require('lodash');
chai = require('chai');
sinon = require('sinon');

expect = chai.expect;

chai.use(require('sinon-chai'));

requireSrc = (relativePath) => {
  return require(path.resolve(__dirname, '..', 'src', relativePath));
}

spec = (callback) => {
  it('.', callback);
}

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