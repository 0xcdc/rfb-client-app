PRAGMA foreign_keys=off

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

INSERT INTO new_household
  SELECT id, address1, address2, city, state, zip, income, note, createdAt, updatedAt
    FROM household

DROP TABLE household

ALTER TABLE new_household RENAME TO household
