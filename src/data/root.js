import Database from 'better-sqlite3';
import config from '../config';

const database = new Database(config.databaseUrl, { verbose: console.info });

database.all = (sql, params) => {
  try {
    const stmt = database.prepare(sql);
    const p = params || {};
    return stmt.all(p);
  } catch (error) {
    console.error({ sql, params, error });
    throw error;
  }
};

database.run = (sql, params) => {
  const p = params || {};

  try {
    const stmt = database.prepare(sql);
    return stmt.run(p);
  } catch (error) {
    console.error({ sql, p, error });
    throw error;
  }
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
  const keys = Object.keys(values);
  const hasVersion = keys.includes('version');
  const versionSql = hasVersion ? 'and version = :version' : '';
  const updateColumns = keys.filter(v => v !== 'id' && v !== 'versoin');
  const sql = `
    update ${tablename}
      set ${updateColumns.map(k => `${k}=$${k}`).join(',\n        ')}
      where id = $id
        ${versionSql}`;
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

export const getNextVersion = database.transaction((tableName, id) => {
  const rows = database.all(
    `
    select max(version) + 1 as version
    from ${tableName}
    where id = :id`,
    { id },
  );

  let version = 1;
  if (rows.length > 0) {
    version = rows[0].version;
  }

  return version;
});

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["obj"] }] */
database.upsert = (tableName, obj, options) => {
  const isVersioned = options && options.isVersioned && true;

  // first, if it's a new row (id == -1) then we need to pull a new key and do an insert
  if (obj.id === -1) {
    obj.id = pullNextKey(tableName);
    if (isVersioned) {
      obj.version = 1;
    }
    database.insert(tableName, obj);
  } else if (isVersioned) {
    // versioned rows are inserts, but we will need to calculate the next version number for the id
    obj.version = getNextVersion(tableName, obj.id);
    database.insert(tableName, obj);
  } else {
    // vanilla update
    database.update(tableName, obj);
  }
  return obj.id;
};

export default database;
