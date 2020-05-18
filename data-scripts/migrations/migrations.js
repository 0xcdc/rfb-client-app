import fs from 'fs';
import path from 'path';

const migrations = [
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
];

for (let i = 0; i < migrations.length; i += 1) {
  const name = migrations[i];
  const sql = fs
    .readFileSync(path.join(__dirname, `${name}.sql`), 'utf8')
    .split(/\n{2,}/);
  migrations[i] = { name, sql };
}

export { migrations as default };
