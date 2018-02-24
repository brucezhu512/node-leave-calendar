'use strict';

const testUtil = require('../index');
const utils = testUtil.require(__filename);

var chai = require('chai');
let assert = chai.assert;

const domain = "node_test"
const key = 'db_test_key';
const sampleJson1 = {"user": "john", "email": "john@example.com"};
const sampleJson2 = {"user": "mary", "email": "mary@example.com"};

describe('utils', () => {
  describe('#save(domain, key, value)', () => {
    it("should return true with valid key", async () => {
      await utils.save(domain, key, sampleJson1);
      assert.isTrue(true);
    });
  });

  describe('#load(domain, key)', () => {
    it("should return same json object with same key", async () => {
      assert.equal(JSON.stringify(await utils.load(domain, key)), JSON.stringify(sampleJson1));
    });

    it("should return null using a brand new key", async () => {
      assert.isNull(await utils.load(domain, Date.now().toString()));
    });
  });

  describe('#find(domain, key, criteria)', () => {
    it("should return row that matches the criteria", async () => {
      assert.isNotNull(await utils.find(domain, (data) => {
        return data.user == 'john';
      }));
    });

    it("should return null when no row matches the criteria", async () => {
      assert.isNull(await utils.find(domain, (data) => {
        return data.user == 'mary';
      }));
    });
  });

  describe('#update(domain, key, callback)', () => {
    it("should return updated row once it was saved successfully", async () => {
      await utils.save(domain, key, sampleJson2);
      assert.isTrue(true);
      
      const newEmail = 'xyz@example.com';
      assert.equal((await utils.update(domain, key, (data) => {
        data.email = newEmail;
      })).email, newEmail);
    });

    it("should throw error when incorrect key is given", async () => {
      const invalidKey = Date.now().toString();
      try {
        await utils.update(domain, invalidKey);
        assert.fail();
      } catch (err) {
        assert.equal(err.message, 'No data was found using key: ' + invalidKey);
      }
    });
  });
});