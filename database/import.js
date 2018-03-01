'use strict';

const userUtil = require('./domains/user');
const leaveUtil = require('./domains/leave');

exports.importAll = async () => {
  await userUtil.init();
  await leaveUtil.init();
};

exports.importAll();