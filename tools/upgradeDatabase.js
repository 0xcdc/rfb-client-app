import { Sequelize, QueryTypes } from 'sequelize';
import migrations from '../data-scripts/migrations/migrations';

async function upgradeDatabase() {
  const seq = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
  });

  let exec = seq
    .query('select * from upgrades order by id desc', {
      raw: true,
      type: QueryTypes.SELECT,
    })
    .then(result => {
      exec = null;

      for (
        let migrationIndex = 0;
        migrationIndex < migrations.length;
        migrationIndex += 1
      ) {
        const m = migrations[migrationIndex];

        if (
          result.some(row => {
            return row.migration === m.name;
          })
        ) {
          console.info(`skipping ${m.name}...`);
        } else {
          let sqlIndex = 0;
          while (sqlIndex < m.sql.length) {
            const sql = m.sql[sqlIndex];
            if (exec) {
              exec = exec.then(() => {
                return seq.query(sql);
              });
            } else {
              exec = seq.query(sql);
            }
            sqlIndex += 1;
          }
          exec = exec.then(() => {
            const sql = `insert into upgrades(migration) values ('${m.name}')`;
            return seq.query(sql);
          });
        }
      }

      return exec;
    });

  await exec;
}

export default upgradeDatabase;
