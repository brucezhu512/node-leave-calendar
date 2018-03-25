'use strict';

const testUtil = require('../../index');
const userUtil = testUtil.require(__filename);

const chai = require('chai');
const assert = chai.assert;

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
      const currentTs = new Date();
      const status = 'Changed by unit test at ' + currentTs;
      const updatedUser = await userUtil.update(uid, (user) => {
        user.status = status;
      })
      assert.equal(updatedUser.status, status);
      assert.isTrue(updatedUser.lastUpdateTimestamp.getTime() >= currentTs.getTime())
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
      const md5 = require('md5');
      assert.isTrue(await userUtil.authenticate(uid, md5("111")));
      assert.isFalse(await userUtil.authenticate(uid, md5("222")));
    });
  });

  describe('#select(criteria)', () => {
    it("should return sample user by given uid (case-insensitive)", async () => {
      const data = await userUtil.select({id: uid});
      assert.equal(data[0].name, 'Bruce');
      const poddata = await userUtil.select({pod: 'Moonraker'});
      assert.isTrue(poddata.length > 0);
    });
  });

  describe('#selectByPod(criteria)', () => {
    it("should return list of users by given names of pods", async () => {
      const data = await userUtil.selectByPod(['Moonraker']);
      assert.isTrue(data.length > 0);
    });
  });

});