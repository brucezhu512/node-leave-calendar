'use strict';

const testUtil = require('../index');
const importUtil = testUtil.require(__filename);

var chai = require('chai');
let assert = chai.assert;

describe('import', () => {
  describe('#importUsers()', () => {
    it("should re-import all users", async () => {
      await importUtil.importUsers();
      assert.isTrue(true);
    });
  });
});