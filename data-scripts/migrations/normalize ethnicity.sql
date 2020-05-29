PRAGMA foreign_keys=off

DROP TABLE IF EXISTS ethnicity

CREATE TABLE ethnicity (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	name varchar(255) NOT NULL UNIQUE
)

insert into ethnicity (id, name) values (0, 'Unknown')

insert into ethnicity (id, name) values (1, 'Hispanic, Latino')

insert into ethnicity (id, name) values (2, 'Other')

DROP TABLE IF EXISTS new_client

CREATE TABLE 'new_client' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(255) NOT NULL,
    'disabled' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'raceId' INTEGER NOT NULL REFERENCES 'race' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'birthYear' INTEGER NOT NULL,
    'genderId' INTEGER NOT NULL REFERENCES 'gender' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'refugeeImmigrantStatus' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'speaksEnglish' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'militaryStatusId' INTEGER NOT NULL REFERENCES 'militaryStatus' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'ethnicityId' INTEGER NOT NULL REFERENCES 'ethnicity' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'householdId' INTEGER NOT NULL REFERENCES 'household' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT
)

update client
  set ethnicity = 'Unknown'
  where ethnicity = ''

insert into new_client
  select client.id, client.name, disabled, raceId, birthYear, genderId, refugeeImmigrantStatus,
    speaksEnglish, militaryStatusId, ethnicity.id, householdId
  from client
    join ethnicity
      on client.ethnicity = ethnicity.name

drop table client

alter table new_client rename to client
