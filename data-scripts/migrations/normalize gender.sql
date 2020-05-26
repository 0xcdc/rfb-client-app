PRAGMA foreign_keys=off

DROP TABLE IF EXISTS gender

CREATE TABLE gender (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	name varchar(255) NOT NULL UNIQUE
)

insert into gender (id, name) values (0, 'Unknown')

insert into gender (id, name) values (1, 'Female')

insert into gender (id, name) values (2, 'Male')

insert into gender (id, name) values (3, 'Transgendered')

DROP TABLE IF EXISTS new_client

CREATE TABLE 'new_client' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(255),
    'disabled' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'raceId' INTEGER NOT NULL REFERENCES 'race' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'birthYear' INTEGER,
    'genderId' INTEGER NOT NULL REFERENCES 'gender' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'refugeeImmigrantStatus' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'speaksEnglish' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'militaryStatus' VARCHAR(255),
    'ethnicity' VARCHAR(255),
    'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT
)

update client
  set gender = 'Male'
  where gender = 'M'

update client
  set gender = 'Unknown'
  where gender = ''

insert into new_client
  select client.id, client.name, disabled, raceId, birthYear, gender.id, refugeeImmigrantStatus,
    speaksEnglish, militaryStatus, ethnicity, householdId
  from client
  join gender
    on client.gender = gender.name

drop table client

alter table new_client rename to client
