'use strict';

const userUtil = require('./domains/user');
const userData = require('./data/users.json').profiles;

exports.importUsers = async () => {
  await userUtil.reset();
  for (let user of userData) {
    await userUtil.save(user);
    console.log(`Import user ${user.id} successfully.`);
  }
};

exports.importUsers();

