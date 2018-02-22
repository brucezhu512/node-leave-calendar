'use strict';

const testUtil = require('../../util');
const redis = testUtil.require(__filename);

var chai = require('chai');

const domain = "node.test"
const key = 'redis.key';
const sampleJson1 = {"user": "john", "email": "john@example.com"};
const sampleJson2 = {"user": "mary", "email": "mary@example.com"};

let assert = chai.assert;

describe('redis', () => {
  describe('#save(domain, key, value)', () => {
    it("should return true with valid key", async () => {
      assert.isTrue(await redis.save(domain, key, sampleJson1));
    });
  });
  describe('#load(domain, key)', () => {
    it("should return same json object as what saved by the key previously", async () => {
      assert.equal(JSON.stringify(await redis.load(domain, key)), JSON.stringify(sampleJson1));
    });
  });
  describe('#saveAndLoad(domain, key, value)', () => {
    it("should return same json object as what saved", async () => {
      assert.equal(JSON.stringify(await redis.saveAndLoad(domain, key, sampleJson2)), JSON.stringify(sampleJson2));
    });
  });
});