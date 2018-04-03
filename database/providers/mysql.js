'use strict';

const mysql = require('mysql');
const debug = require('debug')('database:mysql');

const Config = require('./config');
const conf = new Config().mysql;

exports.load = async (domain, keys, fields) => {
  return await runWithConnection(async (conn) => {
    return await existsWithPromise(conn, domain, keys)
      .then(async (exists) => {
        return exists ?
          await loadWithPromise(conn, domain, keys, fields) : null;
      });
  });
};

exports.save = async (domain, keys, row) => {
  return await runWithConnection(async (conn) => {
    return await saveWithPromise(conn, domain, keys, row);
  });
};

exports.update = async (domain, keys, callback) => {
  const rec = await exports.load(domain, keys);
  if (rec) {
    callback(rec);
    await exports.save(domain, keys, rec);
    return rec;
  } else 
    throw new Error('No data was found with keys: ' + JSON.stringify(keys));
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

function saveWithPromise(conn, domain, keys, row) {
  return new Promise((resolve, reject) => {
    const vals = [];
    const sql = makeInsertOrUpdateStatement(domain, keys, row, vals);

    conn.query(sql, vals, (err, res) => {
      if(err) reject(err);
      debug(`${sql} | [${vals}]`);
      resolve(res);
    })
  });
}

function loadWithPromise(conn, domain, keys, fields = ['*']) {
  return new Promise((resolve, reject) => {
    let sql = `select ${fields.join(', ')} from ${domain.table}`;
    const vals = [];
    const clause = makeWhereClause(vals, keys);
    sql = sql.concat(clause);

    conn.query(sql, vals, (err, res) => {
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
    let sql = `select ${fields.join(', ')} from ${domain.table}`  
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

function existsWithPromise(conn, domain, keys) {
  return new Promise((resolve, reject) => {
    let sql = `select 1 from ${domain.table}`;
    const vals = [];
    const clause = makeWhereClause(vals, keys);
    sql = sql.concat(clause);

    conn.query(sql, vals, (err, res) => {
      if(err) reject(err);
      resolve((res && res.length > 0) ? true : false);
    });
  });
}

function deleteWithPromise(conn, domain, keys) {
  return new Promise((resolve, reject) => {
    let sql = `delete from ${domain.table}`;
    const vals = [];
    const clause = makeWhereClause(vals, keys);
    sql = sql.concat(clause);

    conn.query(sql, vals, (err, res) => {
      if(err) reject(err);
      resolve(res.affectedRows > 0);
    });
  }); 
}

function resetWithPromise(conn, domain) {
  return new Promise((resolve, reject) => {
    let sql = `delete from ${domain.table}`;
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

function makeInsertOrUpdateStatement(domain, keys, row, vals) {
  const stat = {
    sql: `INSERT INTO ${domain.table} (`,
    sqlIns: ` VALUES (`,
    sqlUpd: ` ON DUPLICATE KEY UPDATE`,
  }

  fillStatement(stat, keys, vals);
  fillStatement(stat, row, vals, col => !keys.hasOwnProperty(col));
  fillStatement(stat, domain.constraints, vals, col => !keys.hasOwnProperty(col) && !row.hasOwnProperty(col));
  
  return stat.sql.concat(')', stat.sqlIns, ')', stat.sqlUpd);
}

function fillStatement(stat, ds, vals, check = col => true) {
  for(let col in ds) {
    if(check(col)) {
      stat.sql = stat.sql.concat(stat.sql.endsWith('(') ? `${col}` : `, ${col}`);
      stat.sqlIns = stat.sqlIns.concat(stat.sqlIns.endsWith('(') ? '?' : ', ?');
      stat.sqlUpd = stat.sqlUpd.concat(stat.sqlUpd.endsWith('UPDATE') ? ` ${col} = VALUES(${col})` : `, ${col} = VALUES(${col})`);
      vals.push(ds[col]);
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




