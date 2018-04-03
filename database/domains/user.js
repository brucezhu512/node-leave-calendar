'use strict';

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const Domain = require('./domain');

class User extends Domain {
  constructor() {
    super('user', 'User');
  }

  async update (uid, callback) {
    return await super.update(uid, (user) => {
      callback(user);
      user.lastUpdateTimestamp = new Date();
    });
  }
  
  async isSync(expected)  {
    const latest = await super.load(expected.id);
    return moment(expected.lastUpdateTimestamp).isSame(moment(expected.lastUpdateTimestamp));
  }
  
  async authenticate(uid, md5Pwd) {
    const latest = await super.load(uid);
    const auth = (latest.credential == md5Pwd);
    if (auth) {
      latest.lastSignTimestamp = new Date();
      await super.save(latest);
    }
    return auth;
  }
  
  async selectByPod(pod) {
    return await super.select({pod: pod});
  }

  async init() {
    await super.init(u => {}, user => {
      super.debug(`Import user [${user.id}] successfully.`);
    })
  }
}

module.exports = User;
