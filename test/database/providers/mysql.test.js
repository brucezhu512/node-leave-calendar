'use strict';

const testUtil = require('../../index');
const mysql = testUtil.require(__filename);

var chai = require('chai');
let assert = chai.assert;

const domain = {
  name: "user_test",
  constraints: {
    userType: 1
  }
}
const key = 1000001;
const sampleJson1 = {"username": "john", "email": "john@example.com"};
const sampleJson2 = {"username": "mary", "email": "mary@example.com"};

describe('mysql', () => {
  describe('#save(domain, id, row)', () => {
    it("should return true with valid id", async () => {
      await mysql.save(domain, {id: key}, sampleJson1);
      const rec = await mysql.load(domain, {id: key}, ['username', 'email']);
      assert.equal(rec.username, sampleJson1.username);
      assert.equal(rec.email, sampleJson1.email);
    });
  });

  describe('#load(domain, id)', () => {
    it("should return same json object with same key", async () => {
      const rec = await mysql.load(domain, {id: key}, ['username', 'email']);
      assert.equal(JSON.stringify(rec), JSON.stringify(sampleJson1));
    });

    it("should return null using a brand new key", async () => {
      assert.isNull(await mysql.load(domain, {id: Date.now().toString()}));
    });
  });

  describe('#find(domain, criteria)', () => {
    it("should return row that matches the criteria", async () => {
      assert.isNotNull(await mysql.find(domain, { username: 'john' }));
    });

    it("should return null when no row matches the criteria", async () => {
      assert.isNull(await mysql.find(domain, { username: 'mary' }));
    });
  });

  describe('#select(domain, criteria)', () => {
    it("should return row that matches the criteria", async () => {
      const rows = await mysql.select(domain, { username: 'john' });
      assert.equal(rows[0].username, sampleJson1.username);
      assert.equal(rows[0].email, sampleJson1.email);
    });

    it("should return empty list when no row matches the criteria", async () => {
      const rows = await mysql.select(domain, { username: 'joe' });
      assert.isEmpty(rows);
    });
  });

  describe('#selectWithColumn(domain, cols, criteria)', () => {
    it("should return row with specific columns that matches the criteria", async () => {
      const rows = await mysql.selectWithColumn(domain, ['email'], { username: 'john' });
      assert.isUndefined(rows[0].username);
      assert.equal(rows[0].email, sampleJson1.email);
    });

    it("should return empty list when no row matches the criteria", async () => {
      const rows = await mysql.selectWithColumn(domain, ['username'], { username: 'joe' });
      assert.isEmpty(rows);
    });
  });

  describe('#count(domain, criteria)', () => {
    it("should return number of rows that matches the criteria", async () => {
      const count = await mysql.count(domain, { username: 'john' });
      assert.equal(count, 1);
    });

    it("should return zero when no row matches the criteria", async () => {
      const count = await mysql.count(domain, { username: 'joe' });
      assert.equal(count, 0);
    });
  });

  describe('#update(domain, id, callback)', () => {
    it("should return updated row once it was saved successfully", async () => {
      await mysql.save(domain, {id: key}, sampleJson2);
      const mary = await mysql.load(domain, {id: key}, ['username', 'email']);
      assert.equal(mary.username, sampleJson2.username);
      assert.equal(mary.email, sampleJson2.email);
      
      const newEmail = 'xyz@example.com';
      await mysql.update(domain, {id: key}, (data) => {
        data.email = newEmail;
      });
      const rec = await mysql.load(domain, {id: key});
      assert.equal(rec.email, newEmail);
    });

    it("should throw error when incorrect key is given", async () => {
      const invalidKey = Date.now().toString();
      try {
        await mysql.update(domain, {id: invalidKey});
        assert.fail();
      } catch (err) {
        assert.equal(err.message, 'No data was found with keys: ' + JSON.stringify({id: invalidKey}));
      }
    });
  });

  describe('#delete(domain, criteria)', () => {
    it("should return true where row(s) was deleted", async () => {
      const res = await mysql.delete(domain, {id: key});
      assert.isTrue(res);
    });

    it("should return false when no row exists with the given id", async () => {
      const res = await mysql.delete(domain, {id: key});
      assert.isFalse(res);
    });
  });

});