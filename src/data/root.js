import Database from 'better-sqlite3';
import config from '../config';

const database = new Database(config.databaseUrl, { verbose: console.info });

database.all = (sql, params) => {
  const stmt = database.prepare(sql);
  const p = params || {};
  return stmt.all(p);
};

database.run = (sql, params) => {
  const p = params || {};

  const stmt = database.prepare(sql);
  return stmt.run(p);
};

database.insert = (tablename, values) => {
  const keys = Object.keys(values);
  const info = database.run(
    `
    insert into ${tablename} (${keys.join(', ')})
      values(${keys.map(k => `$${k}`).join(', ')})`,
    values,
  );
  return info.lastInsertRowid;
};

database.update = (tablename, values) => {
  const keys = Object.keys(values).filter(v => v !== 'id');
  const sql = `
update ${tablename}
  set ${keys.map(k => `${k}=$${k}`).join(',\n      ')}
  where id = $id`;
  const info = database.run(sql, values);
  return info;
};

database.delete = (tablename, id) => {
  const info = database.run(
    `
    delete from ${tablename}
      where id = $id`,
    { id },
  );

  return info;
};

export const pullNextKey = database.transaction(tableName => {
  database.run(
    `
    update keys
      set next_key = next_key + 1
      where tablename = :tableName
    `,
    { tableName },
  );

  const rows = database.all(
    `
    select next_key
    from keys
    where tablename = :tableName`,
    { tableName },
  );

  return rows[0].next_key;
});

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["obj"] }] */
database.upsert = (tableName, obj) => {
  if (obj.id === -1) {
    obj.id = pullNextKey(tableName);
    database.insert(tableName, obj);
  } else {
    database.update(tableName, obj);
  }
  return obj.id;
};

export default database;
