'use strict';

const testUtil = require('../../index');
const config = testUtil.require(__filename);

var chai = require('chai');
let assert = chai.assert;

describe('#Config()', () => {
  it("should return travis configurations", async () => {
    process.env.NODE_ENV = 'travis';
    const conf = new config().mysql;
    assert.equal(conf.host, '127.0.0.1');
    assert.equal(conf.user, 'root');
    assert.isUndefined(conf.password);
  });

  it("should return default configurations", async () => {
    process.env.NODE_ENV = 'local';
    const conf = new config().mysql;
    assert.equal(conf.host, 'localhost');
    assert.equal(conf.user, 'root');
    assert.equal(conf.password, 'root');
  });
});