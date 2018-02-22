'use strict';

const userUtil = require('./domains/user');
const userData = require('./data/users.json').profiles;


importUsers();

async function importUsers() {
  for (var user of userData) {
    var saved = await userUtil.save(user.id, user);
    if (saved) {
      console.log(`Load user ${user.id} successfully.`);
    }
  }
}

