PRAGMA foreign_keys=off

DROP TABLE IF EXISTS militaryStatus

CREATE TABLE militaryStatus (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	name varchar(255) NOT NULL UNIQUE
)

insert into militaryStatus (id, name) values (0, 'Unknown')

insert into militaryStatus (id, name) values (1, 'None')

insert into militaryStatus (id, name) values (2, 'US Military Service (past or present)')

insert into militaryStatus (id, name) values (3, 'Partners of persons with active military service')

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
    'militaryStatusId' INTEGER NOT NULL REFERENCES 'militaryStatus' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'ethnicity' VARCHAR(255),
    'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT
)

update client
  set militaryStatus = 'Unknown'
  where militaryStatus = ''

insert into new_client
  select client.id, client.name, disabled, raceId, birthYear, genderId, refugeeImmigrantStatus,
    speaksEnglish, militaryStatus.id, ethnicity, householdId
  from client
    join militaryStatus
      on client.militaryStatus = militaryStatus.name

drop table client

alter table new_client rename to client
