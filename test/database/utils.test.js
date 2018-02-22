'use strict';

const testUtil = require('../index');
const utils = testUtil.require(__filename);

var chai = require('chai');

const domain = "node_test"
const key = 'db_test_key';
const sampleJson1 = {"user": "john", "email": "john@example.com"};
const sampleJson2 = {"user": "mary", "email": "mary@example.com"};

let assert = chai.assert;

describe('utils', () => {

  describe('#save(domain, key, value)', () => {
    it("should return true with valid key", async () => {
      assert.isTrue(await utils.save(domain, key, sampleJson1));
    });
  });

  describe('#load(domain, key, criteria)', () => {
    it("should return same json object as what saved previously without criteria", async () => {
      assert.equal(JSON.stringify(await utils.load(domain, key)), JSON.stringify(sampleJson1));
    });

    it("should return same json object as what saved previously when correct name is given", async () => {
      assert.equal(JSON.stringify(await utils.load(domain, key, (data) => {
        return data.user == 'john';
      })), JSON.stringify(sampleJson1));
    });

    it("should return null when incorrect name is given", async () => {
      assert.isNull(await utils.load(domain, key, (data) => {
        return data.user == 'mary';
      }));
    });

    it("should return null using a brand new key", async () => {
      assert.isNull(await utils.load(domain, Date.now().toString()));
    });
  });

  describe('#find(domain, key, criteria)', () => {
    it("should return true when correct name is given", async () => {
      assert.isTrue(await utils.find(domain, key, (data) => {
        return data.user == 'john';
      }));
    });

    it("should return false when incorrect name is given", async () => {
      assert.isFalse(await utils.find(domain, key, (data) => {
        return data.user == 'mary';
      }));
    });
  });

  describe('#update(domain, key, callback)', () => {
    it("should return true once data was updated and saved successfully", async () => {
      assert.isTrue(await utils.save(domain, key, sampleJson2));

      const newEmail = 'xyz@example.com';
      assert.isTrue(await utils.update(domain, key, (data) => {
        data.email = newEmail;
      }));

      let expected = JSON.parse(JSON.stringify(sampleJson2));
      expected.email = newEmail;
      assert.equal(JSON.stringify(await utils.load(domain, key)), JSON.stringify(expected));
    });

    it("should throw error when incorrect key is given", async () => {
      const invalidKey = Date.now().toString();
      try {
        await utils.update(domain, invalidKey);
        assert.fail();
      } catch (err) {
        assert.equal(err.message, 'No data was found using key ' + invalidKey);
      }
      
    });
  });
});