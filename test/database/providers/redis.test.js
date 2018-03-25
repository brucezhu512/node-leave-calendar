'use strict';

const testUtil = require('../../index');
const redis = testUtil.require(__filename);

var chai = require('chai');
let assert = chai.assert;

const domain = "node.test"
const key1 = 'redis.key1';
const key2 = 'redis.key2';
const sampleJson1 = {"user": "john", "email": "john@example.com"};
const sampleJson2 = {"user": "mary", "email": "mary@example.com"};

describe('redis', () => {

  describe('#save(domain, key, value)', () => {
    it("should save successfully when saving with valid key", async () => {
      await redis.save(domain, key1, sampleJson1);
      await redis.save(domain, key2, sampleJson2);
      assert.isTrue(true);
    });
  });

  describe('#load(domain, key)', () => {
    it("should return same row as what saved by the key previously", async () => {
      assert.equal(JSON.stringify(await redis.load(domain, key1)), JSON.stringify(sampleJson1));
      assert.equal(JSON.stringify(await redis.load(domain, key2)), JSON.stringify(sampleJson2));
    });
  });

  describe('#count(domain, criteria)', () => {
    it("should return number of all rows saved above", async () => {
      assert.equal(await redis.count(domain), 2);
    });

    it("should return number of the rows whose name is john", async () => {
      assert.equal(await redis.count(domain, e => {
        return e.user == "john";
      }), 1);
    });
  });

  describe('#select(domain, criteria)', () => {
    it("should return the list of rows that match the criteria", async () => {
      const johnVals = await redis.select(domain, e => {
        return e.user == "john";
      });
      assert.isArray(johnVals);
      assert.equal(johnVals.length, 1);
      assert.equal(johnVals[0].email, "john@example.com");

      const maryVals = await redis.select(domain, e => {
        return e.user == "mary";
      });
      assert.isArray(maryVals);
      assert.equal(maryVals.length, 1);
      assert.equal(maryVals[0].email, "mary@example.com");

      const allVals = await redis.select(domain);
      assert.isArray(allVals);
      assert.equal(allVals.length, 2);
    });
  });

  describe('#find(domain, criteria)', () => {
    it("should return the first row that match the criteria", async () => {
      const johnVal = await redis.find(domain, e => {
        return e.user == "john";
      });
      assert.isNotArray(johnVal);
      assert.isObject(johnVal);
      assert.equal(johnVal.email, "john@example.com");

      const maryVal = await redis.find(domain, e => {
        return e.user == "mary";
      });
      assert.isNotArray(maryVal);
      assert.isObject(maryVal);
      assert.equal(maryVal.email, "mary@example.com");
    });

    it("should return null with invalid key", async () => {
      const joe = await redis.find(domain, e => {
        return e.user == "joe";
      });
      assert.isNull(joe);
    });
  });

  describe('#delete(domain, key)', () => {
    it("should return true if deletion is successful", async () => {
      assert.isTrue(await redis.delete(domain, key2));
    });
  });

  describe('#reset(domain)', () => {
    it("should return true when domain is correct", async () => {
      assert.isTrue(await redis.reset(domain));
      assert.equal(await redis.count(domain), 0);
    });
  });

});