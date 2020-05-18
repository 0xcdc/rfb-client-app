PRAGMA foreign_keys=off

CREATE TABLE 'new_household' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT,
  'address1' VARCHAR(255),
  'address2' VARCHAR(255),
  'city' VARCHAR(255),
  'state' VARCHAR(255),
  'zip' VARCHAR(255),
  'note' VARCHAR(255),
  'incomeLevelId' INTEGER NOT NULL REFERENCES 'income_level' ('id') ON DELETE SET NULL ON UPDATE CASCADE
)

INSERT INTO new_household
  SELECT h.id, h.address1, h.address2, h.city, h.state, h.zip, h.note, i.id
    FROM household h
    JOIN income_level i
      ON h.income = i.income_level

DROP TABLE household

ALTER TABLE new_household RENAME TO household
