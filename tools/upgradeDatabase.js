import Database from 'better-sqlite3';
import migrations from '../data-scripts/migrations/migrations';

const db = new Database('database.sqlite', { verbose: console.info });

function run(sql, params) {
  const stmt = db.prepare(sql);
  const p = params || [];
  return stmt.run(...p);
}

function all(sql, params) {
  const stmt = db.prepare(sql);
  const p = params || [];
  return stmt.all(...p);
}

function sqlMigration(sqlList) {
  let sqlIndex = 0;
  while (sqlIndex < sqlList.length) {
    const sql = sqlList[sqlIndex];
    run(sql);
    sqlIndex += 1;
  }
}

function upgradeDatabase() {
  return Promise.all(migrations.moduleLoads).then(() => {
    const result = all('select * from upgrades order by id desc');

    for (
      let migrationIndex = 0;
      migrationIndex < migrations.migrationList.length;
      migrationIndex += 1
    ) {
      const migration = migrations.migrationList[migrationIndex];

      if (result.some(row => row.migration === migration.name)) {
        console.info(`skipping ${migration.name}...`);
      } else {
        if (migration.sql) {
          sqlMigration(migration.sql);
        } else {
          migration.func(sqlMigration);
        }

        const sql = `insert into upgrades(migration) values ('${migration.name}')`;
        run(sql);
      }
    }

    return true;
  });
}

export default upgradeDatabase;
