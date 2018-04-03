const Domain = require('../domains/domain');

class ReferenceCode extends Domain {
  constructor(type) {
    super(type, 'ReferenceCode', ['code'], {type: type});
    this.codeType = type;
  }

  async getAll(activeOnly = true) {
    return await super.selectWithColumn(['code', 'name', 'description'], activeOnly ? {active: 1} : {});
  }

  async getByCode(code) {
    return await super.find({code: code});
  }

  async getByName(name) {
    return await super.find({name: name});
  }

  async init() {
    await super.init(rec => {}, rec => {
      this.debug(`Import ${this.codeType} "${rec.name}" successfully.`);
    });
  }
}



