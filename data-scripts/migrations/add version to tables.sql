PRAGMA foreign_keys=off

drop table if exists new_client

CREATE TABLE 'new_client' (
    'id' INTEGER NOT NULL,
    'version' INTEGER NOT NULL,
    'name' VARCHAR(255) NOT NULL,
    'disabled' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'raceId' INTEGER NOT NULL REFERENCES 'race' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'birthYear' INTEGER NOT NULL,
    'genderId' INTEGER NOT NULL REFERENCES 'gender' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'refugeeImmigrantStatus' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'speaksEnglish' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'militaryStatusId' INTEGER NOT NULL REFERENCES 'militaryStatus' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'ethnicityId' INTEGER NOT NULL REFERENCES 'ethnicity' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'householdId' INTEGER NOT NULL,
    PRIMARY KEY(id, version)
)

insert into new_client
  select client.id, 1, client.name, disabled, raceId, birthYear, genderId, refugeeImmigrantStatus,
    speaksEnglish, militaryStatusId, ethnicityId, householdId
  from client

drop table client

alter table new_client rename to client

DROP TABLE IF EXISTS 'new_household'

CREATE TABLE 'new_household' (
  'id' INTEGER NOT NULL,
  'version' INTEGER NOT NULL,
  'address1' VARCHAR(255),
  'address2' VARCHAR(255),
  'cityId' INTEGER NOT NULL REFERENCES 'city' ('id') ON DELETE SET NULL ON UPDATE CASCADE,
  'zip' VARCHAR(255),
  'note' VARCHAR(255),
  'incomeLevelId' INTEGER NOT NULL REFERENCES 'income_level' ('id') ON DELETE SET NULL ON UPDATE CASCADE,
  PRIMARY KEY(id, version)
)

INSERT INTO new_household
  SELECT h.id, 1, h.address1, h.address2, h.cityId, h.zip, h.note, h.incomeLevelId
    FROM household h

DROP TABLE household

ALTER TABLE new_household RENAME TO household

drop table if exists new_visit

CREATE TABLE 'new_visit' (
  'id' INTEGER NOT NULL PRIMARY KEY,
  'date' VARCHAR(255) NOT NULL,
  'householdId' INTEGER NOT NULL,
  'householdVersion' INTEGER NOT NULL,
  FOREIGN KEY(householdId, householdVersion) references household(id, version) ON DELETE SET NULL ON UPDATE CASCADE
)

INSERT INTO new_visit
  SELECT v.id, v.date, v.householdId, 1
    FROM visit v

DROP TABLE visit

ALTER TABLE new_visit RENAME TO visit

CREATE INDEX `visit_household_id` ON `visit` (`householdId`)

DROP TABLE IF EXISTS household_client_list

CREATE TABLE 'household_client_list' (
  householdId INTEGER NOT NULL,
  householdVersion INTEGER NOT NULL,
  clientId INTEGER NOT NULL,
  clientVersion INTEGER NOT NULL,
  PRIMARY KEY(householdId, householdVersion, clientId, clientVersion),
  FOREIGN KEY(householdId, householdVersion) references household(id, version) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(clientId, clientVersion) references client(id, version) ON DELETE SET NULL ON UPDATE CASCADE
)

insert into household_client_list
  select h.id, h.version, c.id, c.version
    from household h
    join client c
      on c.householdId = h.id
