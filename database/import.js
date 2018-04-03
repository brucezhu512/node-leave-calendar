'use strict';

const User = require('./domains/user');
const TimeRecord = require('./domains/timerecord');

exports.importAll = async () => {
  await new User().init();
  await new TimeRecord('leave', 1).init();
  await new TimeRecord('catchup', 2).init();
};

exports.importAll();