'use strict';

const mysql = require('mysql');
const debug = require('debug')('database:mysql');

const Config = require('./config');
const conf = new Config().mysql;

exports.load = async (domain, id, fields) => {
  return await runWithConnection(async (conn) => {
    return await existsWithPromise(conn, domain, id)
      .then(async (exists) => {
        return exists ?
          await loadWithPromise(conn, domain, id, fields) : null;
      });
  });
};

exports.save = async (domain, id, row) => {
  return await runWithConnection(async (conn) => {
    return await saveWithPromise(conn, domain, id, row);
  });
};

exports.update = async (domain, id, callback) => {
  const rec = await exports.load(domain, id);
  if (rec) {
    callback(rec);
    await exports.save(domain, id, rec);
    return rec;
  } else 
    throw new Error('No data was found with id: ' + id);
};

exports.find = async (domain, criteria) => {
  return await runWithConnection(async (conn) => {
    const res = await selectWithPromise(conn, domain, ['*'], criteria);
    return (res && res.length > 0) ? res[0] : null;
  });
};

exports.select = async (domain, criteria = {}) => {
  return await runWithConnection(async (conn) => {
    return await selectWithPromise(conn, domain, ['*'], criteria);
  });
};

exports.selectWithColumn = async (domain, cols, criteria = {}) => {
  return await runWithConnection(async (conn) => {
    return await selectWithPromise(conn, domain, cols, criteria);
  });
};

exports.count = async (domain, criteria = {}) => {
  return await runWithConnection(async (conn) => {
    const res =  await selectWithPromise(conn, domain, ['count(1) as rowCount'], criteria);
    return res[0].rowCount;
  });
};

exports.delete = async (domain, id) => {
  return await runWithConnection(async (conn) => {
    return await deleteWithPromise(conn, domain, id);
  });
};

exports.reset = async (domain) => {
  return await runWithConnection(async (conn) => {
    return await resetWithPromise(conn, domain);
  });
};

async function runWithConnection(callback) {
  let connection = mysql.createConnection(conf);
  try {
    return await callback(connection);
  } finally {
    connection.end();
  }
}

function saveWithPromise(conn, domain, id, row) {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO ${domain.name} (id`
    let sqlIns = ` VALUES (?`
    let sqlUpd = ` ON DUPLICATE KEY UPDATE `
    const vals = [id]
    fillFields(row, (col, val) => {
      sql = sql.concat(`, ${col}`);
      sqlIns = sqlIns.concat(`, ?`);
      sqlUpd = sqlUpd.concat(`${col} = VALUES(${col}), `)
      vals.push(val);
    });

    fillFields(domain.constraints, (col, val) => {
      sql = sql.concat(`, ${col}`);
      sqlIns = sqlIns.concat(`, ?`);
      sqlUpd = sqlUpd.concat(`${col} = VALUES(${col}), `)
      vals.push(val);
    });

    sql = sql.concat(')', sqlIns, ')', sqlUpd.substr(0, sqlUpd.length -2));
    conn.query(sql, vals, (err, res) => {
      if(err) reject(err);
      debug(`${sql} | [${vals}]`);
      resolve(res);
    })
  });
}

function loadWithPromise(conn, domain, id, fields = ['*']) {
  return new Promise((resolve, reject) => {
    conn.query(`select ${fields.join(', ')} from ${domain.name} where id = "${id}"`, (err, res) => {
      if(err) reject(err);
      const rec = res[0];
      if(rec) {
        for(let field in domain.constraints) {
          delete rec[field];
        }
      }
      resolve(rec);
    });
  });
}

function selectWithPromise(conn, domain, fields, criteria) {
  return new Promise((resolve, reject) => {
    let sql = `select ${fields.join(', ')} from ${domain.name}`  
    const vals = [];
    const clause = makeWhereClause(vals, domain.constraints, criteria);
    sql = sql.concat(clause);
    
    conn.query(sql, vals, (err, rows) => {
      if(err) reject(err);
      debug(`${sql} | [${vals}] -> ${rows.length} row(s) selected.`);
      resolve(rows);
    });
  });
}

function existsWithPromise(conn, domain, id) {
  return new Promise((resolve, reject) => {
    conn.query(`select 1 from ${domain.name} where id = "${id}"`, (err, res) => {
      if(err) reject(err);
      resolve((res && res.length > 0) ? true : false);
    });
  });
}

function deleteWithPromise(conn, domain, id) {
  return new Promise((resolve, reject) => {
    conn.query(`delete from ${domain.name} where id = '${id}'`, (err, res) => {
      if(err) reject(err);
      resolve(res.affectedRows > 0);
    });
  }); 
}

function resetWithPromise(conn, domain) {
  return new Promise((resolve, reject) => {
    let sql = `delete from ${domain.name}`;
    const vals = [];
    const clause = makeWhereClause(vals, domain.constraints);
    sql = sql.concat(clause);

    conn.query(sql, vals, (err, res) => {
      if(err) reject(err);
      debug(`${sql} | [${vals}] -> ${res.affectedRows} row(s) deleted.`);
      resolve(res.serverStatus == 2);
    });
  }); 
}

function fillFields(ds, callback, excludes = []) {
  for(let key in ds) {
    if (key != 'id' && !excludes.includes(key)) {
      callback(key, ds[key]);
    }
  } 
}

function makeWhereClause(vals, ...ds) {
  const clauses = [];
  ds.forEach(e => {
    for(let col in e) {
      clauses.push(`${col} = ?`);
      vals.push(e[col]);
    } 
  });

  return (clauses.length > 0) ? ` where ${clauses.join(' and ')}` : '';
}




