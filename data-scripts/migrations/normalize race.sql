PRAGMA foreign_keys=off

DROP TABLE IF EXISTS race

CREATE TABLE race  (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	name varchar(255) NOT NULL UNIQUE
)

insert into race (id, name) values (0, 'Unknown')

insert into race (name) values ('Asian, Asian-American')

insert into race (name) values ('Black, African-American, Other African')

insert into race (name) values ('Latino, Latino American, Hispanic')

insert into race (name) values ('Hawaiian-Native or Pacific Islander')

insert into race (name) values ('Indian-American or Alaskan-Native')

insert into race (name) values ('White or Caucasian')

insert into race (name) values ('Other Race')

insert into race (name) values ('Multi-Racial (2+ identified)')

DROP TABLE IF EXISTS new_client

CREATE TABLE 'new_client' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(255),
    'disabled' VARCHAR(255),
    'raceId' INTEGER NOT NULL REFERENCES 'race' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'birthYear' INTEGER,
    'gender' VARCHAR(255),
    'refugeeImmigrantStatus' VARCHAR(255),
    'speaksEnglish' VARCHAR(255),
    'militaryStatus' VARCHAR(255),
    'ethnicity' VARCHAR(255),
    'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT
)

update client
  set race = 'Unknown'
  where race = ''

update client
  set race = 'Latino, Latino American, Hispanic'
  where race = 'Hispanic'

insert into new_client
  select client.id, client.name, disabled, race.id, birthYear, gender, refugeeImmigrantStatus,
    speaksEnglish, militaryStatus, ethnicity, householdId
  from client
    join race
      on client.race = race.name

drop table client

alter table new_client rename to client
