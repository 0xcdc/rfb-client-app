import fs from 'fs';
import path from 'path';

const migrations = {
  migrationList: [
    'drop household.oldHouseholdId',
    'drop household.dateEntered',
    'drop client.dateEntered & client.enteredBy',
    'combine client.firstName & client.lastName',
    'client disabled, immigrant status, & speaksEnglish to boolean',
    'drop client created & updated timestamps',
    'drop household created & updated timestamps',
    'drop visit created & updated timestamps',
    'create income_level',
    'normalize household.income',
    'recreate indexes',
    'create city',
    'fix city names',
    'normalize city names',
    'make income_level 0 unknown',
    'normalize race',
    'convert yesNo fields to INTEGER',
    'normalize gender',
    'normalize militaryStatus',
    'normalize ethnicity',
  ],
  moduleLoads: [],
};

for (let i = 0; i < migrations.migrationList.length; i += 1) {
  const name = migrations.migrationList[i];
  const sqlFilename = path.join(__dirname, `${name}.sql`);
  if (fs.existsSync(sqlFilename)) {
    const sql = fs.readFileSync(sqlFilename, 'utf8').split(/\n{2,}/);
    migrations.migrationList[i] = { name, sql };
  } else {
    const jsFilename = path.join(__dirname, `${name}.js`);
    const module = import(jsFilename);
    migrations.moduleLoads.push(
      module.then(m => {
        migrations.migrationList[i] = { name, func: m.default };
        return m.default;
      }),
    );
  }
}

export { migrations as default };
