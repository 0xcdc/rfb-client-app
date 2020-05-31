PRAGMA foreign_keys=off

DROP TABLE IF EXISTS keys

CREATE TABLE keys (
  tablename varchar(255) PRIMARY KEY NOT NULL,
  next_key INTEGER NOT NULL
)

insert into keys
  select 'visit', max(id) from visit

insert into keys
  select 'household', max(id) from household

insert into keys
  select 'client', max(id) from client
