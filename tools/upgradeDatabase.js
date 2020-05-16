import { Sequelize, QueryTypes } from 'sequelize';

const migrations = [
  {
    name: 'drop household.oldHouseholdId',
    sql: [
      `
      PRAGMA foreign_keys=off;
      `,
      `
      CREATE TABLE 'new_household' (
        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
        'address1' VARCHAR(255),
        'address2' VARCHAR(255),
        'city' VARCHAR(255),
        'state' VARCHAR(255),
        'zip' VARCHAR(255),
        'income' VARCHAR(255),
        'note' VARCHAR(255),
        'dateEntered' VARCHAR(255),
        'createdAt' DATETIME NOT NULL,
        'updatedAt' DATETIME NOT NULL)
      `,
      `
      INSERT INTO new_household
        SELECT id, address1, address2, city, state, zip, income, note, dateEntered, createdAt, updatedAt
          FROM household
      `,
      `
      DROP TABLE household
      `,
      `
      ALTER TABLE new_household RENAME TO household
      `,
    ],
  },
  {
    name: 'drop household.dateEntered',
    sql: [
      `
      PRAGMA foreign_keys=off;
      `,
      `
      CREATE TABLE 'new_household' (
        'id' INTEGER PRIMARY KEY AUTOINCREMENT,
        'address1' VARCHAR(255),
        'address2' VARCHAR(255),
        'city' VARCHAR(255),
        'state' VARCHAR(255),
        'zip' VARCHAR(255),
        'income' VARCHAR(255),
        'note' VARCHAR(255),
        'createdAt' DATETIME NOT NULL,
        'updatedAt' DATETIME NOT NULL)
      `,
      `
      INSERT INTO new_household
        SELECT id, address1, address2, city, state, zip, income, note, createdAt, updatedAt
          FROM household
      `,
      `
      DROP TABLE household
      `,
      `
      ALTER TABLE new_household RENAME TO household
      `,
    ],
  },
  {
    name: 'drop client.dateEntered & client.enteredBy',
    sql: [
      `
      CREATE TABLE 'new_client' (
          'id' INTEGER PRIMARY KEY AUTOINCREMENT,
          'firstName' VARCHAR(255),
          'lastName' VARCHAR(255),
          'disabled' VARCHAR(255),
          'race' VARCHAR(255),
          'birthYear' INTEGER,
          'gender' VARCHAR(255),
          'refugeeImmigrantStatus' VARCHAR(255),
          'speaksEnglish' VARCHAR(255),
          'militaryStatus' VARCHAR(255),
          'ethnicity' VARCHAR(255),
          'createdAt' DATETIME NOT NULL,
          'updatedAt' DATETIME NOT NULL,
          'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE SET NULL ON UPDATE CASCADE)
      `,
      `
      INSERT INTO new_client
        SELECT id, firstName, lastName, disabled, race, birthYear, gender, refugeeImmigrantStatus, speaksEnglish,
          militaryStatus, ethnicity, createdAt, updatedAt, householdId
          FROM client
      `,
      `
      DROP TABLE client
      `,
      `
      ALTER TABLE new_client RENAME TO client
      `,
    ],
  },
  {
    name: 'combine client.firstName & client.lastName',
    sql: [
      `
      CREATE TABLE 'new_client' (
          'id' INTEGER PRIMARY KEY AUTOINCREMENT,
          'name' VARCHAR(255),
          'disabled' VARCHAR(255),
          'race' VARCHAR(255),
          'birthYear' INTEGER,
          'gender' VARCHAR(255),
          'refugeeImmigrantStatus' VARCHAR(255),
          'speaksEnglish' VARCHAR(255),
          'militaryStatus' VARCHAR(255),
          'ethnicity' VARCHAR(255),
          'createdAt' DATETIME NOT NULL,
          'updatedAt' DATETIME NOT NULL,
          'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE SET NULL ON UPDATE CASCADE)
      `,
      `
      INSERT INTO new_client
        SELECT id, firstName || ' ' || lastName, disabled, race, birthYear, gender, refugeeImmigrantStatus, speaksEnglish,
          militaryStatus, ethnicity, createdAt, updatedAt, householdId
          FROM client
      `,
      `
      DROP TABLE client
      `,
      `
      ALTER TABLE new_client RENAME TO client
      `,
    ],
  },
  {
    name: 'client disabled, immigrant status, & speaksEnglish to boolean',
    sql: [
      `
      CREATE TABLE 'new_client' (
          'id' INTEGER PRIMARY KEY AUTOINCREMENT,
          'name' VARCHAR(255),
          'disabled' tinyint,
          'race' VARCHAR(255),
          'birthYear' INTEGER,
          'gender' VARCHAR(255),
          'refugeeImmigrantStatus' VARCHAR(255),
          'speaksEnglish' tinyint,
          'militaryStatus' tinyint,
          'ethnicity' VARCHAR(255),
          'createdAt' DATETIME NOT NULL,
          'updatedAt' DATETIME NOT NULL,
          'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE SET NULL ON UPDATE CASCADE)
      `,
      `
      INSERT INTO new_client
        SELECT id, name, disabled, race, birthYear, gender, refugeeImmigrantStatus, speaksEnglish,
          militaryStatus, ethnicity, createdAt, updatedAt, householdId
          FROM client
      `,
      `
      DROP TABLE client
      `,
      `
      ALTER TABLE new_client RENAME TO client
      `,
    ],
  },
];

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
