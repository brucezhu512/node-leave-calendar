const dbUtils = require('../utils');

class ReferenceCode {
  constructor(type) {
    this.type = type;
    this.debug = require('debug')(`ref-code:${type}`);
    this.domain = { 
      name: 'ReferenceCode',
      key: 'code',
      constraints: {
        type: type
      }
    };
  }

  async getAll(activeOnly = true) {
    return await dbUtils.selectWithColumn(this.domain, ['code', 'name', 'description'], activeOnly ? {active: 1} : {});
  }

  async getByCode(code) {
    return await dbUtils.find(this.domain, {code: code});
  }

  async getByName(name) {
    return await dbUtils.find(this.domain, {name: name});
  }

  async import() {
    await dbUtils.reset(this.domain);
    const refcodes = require('../data/data.json')[this.type];
    for (let refcode of refcodes) {
      await dbUtils.save(this.domain, {}, refcode);
      this.debug(`Import ${this.type} "${refcode.name}" successfully.`);
    }
  }
}

const c = new ReferenceCode("pod");
c.getAll(false).then(res => {
  console.log(res);
});
