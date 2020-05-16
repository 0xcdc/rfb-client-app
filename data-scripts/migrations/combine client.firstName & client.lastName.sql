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

INSERT INTO new_client
  SELECT id, firstName || ' ' || lastName, disabled, race, birthYear, gender, refugeeImmigrantStatus, speaksEnglish,
    militaryStatus, ethnicity, createdAt, updatedAt, householdId
    FROM client

DROP TABLE client

ALTER TABLE new_client RENAME TO client
