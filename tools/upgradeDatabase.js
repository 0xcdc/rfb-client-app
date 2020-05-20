import { Sequelize, QueryTypes } from 'sequelize';
import migrations from '../data-scripts/migrations/migrations';

const seq = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

function sqlMigration(e, sqlList) {
  let exec = e;
  let sqlIndex = 0;
  while (sqlIndex < sqlList.length) {
    const sql = sqlList[sqlIndex];
    if (exec) {
      exec = exec.then(() => {
        return seq.query(sql);
      });
    } else {
      exec = seq.query(sql);
    }
    sqlIndex += 1;
  }
  return exec;
}

async function upgradeDatabase() {
  let exec = seq.query('select * from upgrades order by id desc', {
    raw: true,
    type: QueryTypes.SELECT,
  });

  Promise.all([exec, migrations.loadModules]).then(resultList => {
    const result = resultList[0];
    exec = null;

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
          exec = sqlMigration(exec, migration.sql);
        } else {
          exec = migration.func(exec, sqlMigration);
        }

        exec = exec.then(() => {
          const sql = `insert into upgrades(migration) values ('${migration.name}')`;
          return seq.query(sql);
        });
      }
    }

    return exec;
  });

  await exec;
}

export default upgradeDatabase;
