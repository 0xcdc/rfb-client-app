PRAGMA foreign_keys=off

CREATE TABLE 'new_visit' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT,
  'date' VARCHAR(255),
  'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE CASCADE ON UPDATE CASCADE)

INSERT INTO new_visit
  SELECT id, date, householdId
    FROM visit

DROP TABLE visit

ALTER TABLE new_visit RENAME TO visit
