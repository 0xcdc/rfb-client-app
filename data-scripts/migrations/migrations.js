import fs from 'fs';
import path from 'path';

const migrations = [];

function appendMigration(name) {
  const sql = fs
    .readFileSync(path.join(__dirname, `${name}.sql`), 'utf8')
    .split(/\n{2,}/);
  migrations.push({ name, sql });
}

appendMigration('drop household.oldHouseholdId');
appendMigration('drop household.dateEntered');
appendMigration('drop client.dateEntered & client.enteredBy');
appendMigration('combine client.firstName & client.lastName');
appendMigration(
  'client disabled, immigrant status, & speaksEnglish to boolean',
);
appendMigration('drop client created & updated timestamps');
appendMigration('drop household created & updated timestamps');
appendMigration('drop visit created & updated timestamps');

export { migrations as default };
