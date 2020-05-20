PRAGMA foreign_keys=off

DROP TABLE IF EXISTS 'new_household'

CREATE TABLE 'new_household' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT,
  'address1' VARCHAR(255),
  'address2' VARCHAR(255),
  'cityId' INTEGER NOT NULL REFERENCES 'city' ('id') ON DELETE SET NULL ON UPDATE CASCADE,
  'zip' VARCHAR(255),
  'note' VARCHAR(255),
  'incomeLevelId' INTEGER NOT NULL REFERENCES 'income_level' ('id') ON DELETE SET NULL ON UPDATE CASCADE
)

INSERT INTO new_household
  SELECT h.id, h.address1, h.address2, c.id, h.zip, h.note, h.incomeLevelId
    FROM household h
    JOIN city c
      on c.name = h.city or
         (c.id=0 and h.city='')

DROP TABLE household

ALTER TABLE new_household RENAME TO household
