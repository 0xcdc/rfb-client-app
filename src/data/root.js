import Database from 'better-sqlite3';
import config from '../config';

const database = new Database(config.databaseUrl, { verbose: console.info });

database.all = (sql, params) => {
  const stmt = database.prepare(sql);
  const p = params || {};
  return stmt.all(p);
};

database.run = (sql, params) => {
  const stmt = database.prepare(sql);
  const p = params || {};
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

export default database;
