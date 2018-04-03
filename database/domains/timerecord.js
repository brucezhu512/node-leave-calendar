'use strict';

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const Domain = require('./domain');

class TimeRecord extends Domain {
  constructor(name, typecode) {
    super(name, 'TimeRecord', ['id'], {type: typecode});
  }
  
  async selectByUid(uid, from, to) {
    return await this.selectByDateRange(from, to, { uid: uid });
  }
  
  async selectByDateRange(from, to, condition) {
    const dtFrom = moment(from);
    const dtTo = moment(to);
    const data = await super.select(condition);
    return data.filter(rec => {
      const dtRec = moment(rec.date);
      return dtRec.isBetween(dtFrom, dtTo, 'd', '[]');
    });
  }
  
  async submitByDateRange(uid, from, to, newData) {
    const data = await this.selectByUid(uid, from, to);
  
    for (let rec of data) {
      await super.delete(rec.id);
    }
    
    for (let newRec of newData) {
      if(moment(newRec.date).isBetween(moment(from), moment(to), 'd', '[]')) {
        newRec.uid = uid;
        await super.save(newRec);
      }
    }
  }

  async init() {
    const stats = {};
    await super.init(rec => { rec.id = Date.now(); }, rec => {
      const rowCount = stats[rec.uid];
      stats[rec.uid] = rowCount ? (rowCount+1) : 1;
    });

    for (let uid in stats) {
      if (stats.hasOwnProperty(uid)) {
        super.debug(`Import ${stats[uid]} leave row(s) of ${uid} successfully.`);
      }
    }
  }
}

module.exports = TimeRecord;