'use strict';

const dbUtils = require('../utils');

class Domain {
  constructor(name, table, keys = ['id'], constraints = {}) {
    this.debug = require('debug')(`domain:${name}`);
    this.dname = name;
    this.keys = keys
    this.domain = {
      table: table,
      constraints: constraints,
    };
  }

  async load(keyVal) {
    return await dbUtils.load(this.domain, this._getKeyParamByVal(keyVal));
  };
  
  async save(rec)  {
    return await dbUtils.save(this.domain, this._getKeyParamByRec(rec), rec);
  };

  async update(keyVal, callback)  {
    return await dbUtils.update(this.domain, this._getKeyParamByVal(keyVal), callback)
  };

  async delete(keyVal) {
    return await dbUtils.delete(this.domain, this._getKeyParamByVal(keyVal)); 
  }

  async run(callback) {
    return await callback(dbUtils);
  }

  async select(criteria) {
    return await dbUtils.select(this.domain, criteria);
  }

  debug(message) {
    this.debug(message);
  }

  async init(preProc = rec => {}, postProc = rec => {}) {
    await dbUtils.reset(this.domain);
    const data = require('../data/data.json')[this.dname];
    for (let rec of data) {
      preProc(rec);
      await this.save(rec);
      postProc(rec);
    }
  }

   _getKeyParamByRec(rec) {
    const keyObj = {};
    this.keys.forEach(k => keyObj[k] = rec[k]);
    return keyObj;
  }
  
  _getKeyParamByVal(val) {
    const keyObj = {};
    if (val instanceof Array) {
      this.keys.forEach(k => keyObj[k] = val[k]);
    } else {
      keyObj[this.keys[0]] = val;
    }
    return keyObj;
  }
}



module.exports = Domain;
