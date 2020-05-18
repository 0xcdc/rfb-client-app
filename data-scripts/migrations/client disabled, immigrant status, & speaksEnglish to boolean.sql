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

INSERT INTO new_client
  SELECT id, name, disabled, race, birthYear, gender, refugeeImmigrantStatus, speaksEnglish,
    militaryStatus, ethnicity, createdAt, updatedAt, householdId
    FROM client

DROP TABLE client

ALTER TABLE new_client RENAME TO client

CREATE INDEX `client_household_id` ON `client` (`householdId`)
