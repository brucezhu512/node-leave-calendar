'use strict';

const userUtil = require('./domains/user');
const leaveUtil = require('./domains/leave');
const catchupUtil = require('./domains/catchup');

exports.importAll = async () => {
  await userUtil.init();
  await leaveUtil.init();
  await catchupUtil.init();
};

exports.importAll();