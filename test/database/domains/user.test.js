'use strict';

const testUtil = require('../../index');
const userUtil = testUtil.require(__filename);

var chai = require('chai');
var assert = chai.assert;

// SAMPLE USER JSON FOR REFERENCE ONLY ... DON'T USE IT DIRECTLY
const sample = {
  "id": "u353910",
  "name": "Bruce",
  "credential": "111",
  "pods": "Moonraker",
  "roles": "Developer, Admin"
}

const uid = 'u353910';


describe('user', () => {
  before(async () => {
    await userUtil.init();
  });

  describe('#load(uid)', () => {
    it("should return sample user by given uid (case-insensitive)", async () => {
      assert.isNotNull(await userUtil.load(uid));
      assert.isNotNull(await userUtil.load(uid.toUpperCase()));
    });

    it("should return null by invalid uid", async () => {
      assert.isNull(await userUtil.load(Date.now().toString()));
    });
  });

  describe('#save(user)', () => {
    it("should save successfully", async () => {
      const uid = "u000001";
      await userUtil.save({"id": uid, "name": "robot"});
      assert.equal((await userUtil.load(uid)).name, "robot");
    });
  });

  describe('#update(uid, callback)', async () => {
    it("should return same user with updated information and last updated timestamp", async () => {
      const currentTs = Date.now();
      const comment = 'Changed by unit test at ' + currentTs;
      const updatedUser = await userUtil.update(uid, (user) => {
        user.comment = comment;
      })
      assert.equal(updatedUser.comment, comment);
      assert.isAbove(updatedUser.lastUpdateTimestamp, currentTs)
    });
  });

  describe('#isSync(uid, user)', () => {
    it("should return true if it was saved ", async () => {
      const id = "u000001";
      const user = await userUtil.update(id, (user) => {});
      assert.isTrue(await userUtil.isSync(user));
    });
  });

  describe('#authenticate(uid, password)', () => {
    it("should return true if uid and password are correct.", async () => {
      assert.isTrue(await userUtil.authenticate(uid, "111"));
      assert.isFalse(await userUtil.authenticate(uid, "222"));
    });
  });

});