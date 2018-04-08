'use strict';

const User = require('./domains/user');
const TimeRecord = require('./domains/timerecord');
const ReferenceCode = require('./domains/referencecode');

exports.importAll = async () => {
  await new User().init();
  await new TimeRecord('leave', 1).init();
  await new TimeRecord('catchup', 2).init();
  await new ReferenceCode('pod').init();
};

exports.importAll();