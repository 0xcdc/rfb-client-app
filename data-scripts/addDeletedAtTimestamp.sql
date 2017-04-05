alter table client
  add deleted_on varchar(255) NULL;

alter table household
  add deleted_on varchar(255) NULL;
