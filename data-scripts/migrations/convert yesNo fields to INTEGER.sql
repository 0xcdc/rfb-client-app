PRAGMA foreign_keys=off

DROP TABLE IF EXISTS yes_no

CREATE TABLE yes_no (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	name varchar(255) NOT NULL UNIQUE
)

insert into yes_no (id, name) values ('-1', 'Unknown')

insert into yes_no (id, name) values (0, 'No')

insert into yes_no (id, name) values ('1', 'Yes')

DROP TABLE IF EXISTS new_client

CREATE TABLE 'new_client' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' VARCHAR(255),
    'disabled' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'raceId' INTEGER NOT NULL REFERENCES 'race' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'birthYear' INTEGER,
    'gender' VARCHAR(255),
    'refugeeImmigrantStatus' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'speaksEnglish' INTEGER NOT NULL REFERENCES 'yes_no' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT,
    'militaryStatus' VARCHAR(255),
    'ethnicity' VARCHAR(255),
    'householdId' INTEGER REFERENCES 'household' ('id') ON DELETE RESTRICT ON UPDATE RESTRICT
)

update client
  set disabled = -1
  where disabled = ''

update client
  set refugeeImmigrantStatus  = -1
  where refugeeImmigrantStatus  = ''

update client
  set speaksEnglish = -1
  where speaksEnglish = ''

insert into new_client
  select client.id, client.name, disabled, raceId, birthYear, gender, refugeeImmigrantStatus,
    speaksEnglish, militaryStatus, ethnicity, householdId
  from client

drop table client

alter table new_client rename to client
