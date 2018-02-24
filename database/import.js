'use strict';

const userUtil = require('./domains/user');

exports.importAll = async () => {
  await userUtil.init();
};

exports.importAll();