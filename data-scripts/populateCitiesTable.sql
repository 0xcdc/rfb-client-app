create table cities (id INTEGER PRIMARY KEY, name varchar(255), break_out int, in_king_county int);

insert into cities (name, break_out, in_king_county) values('Auburn', 1, 1);
insert into cities (name, break_out, in_king_county) values('Bellevue', 1, 1);
insert into cities (name, break_out, in_king_county) values('Bothell', 1, 1);
insert into cities (name, break_out, in_king_county) values('Burien', 1, 1);
insert into cities (name, break_out, in_king_county) values('Covington', 1, 1);
insert into cities (name, break_out, in_king_county) values('Des Moines', 1, 1);
insert into cities (name, break_out, in_king_county) values('Federal Way', 1, 1);
insert into cities (name, break_out, in_king_county) values('Issaquah', 1, 1);
insert into cities (name, break_out, in_king_county) values('Kenmore', 1, 1);
insert into cities (name, break_out, in_king_county) values('Kent', 1, 1);
insert into cities (name, break_out, in_king_county) values('Kirkland', 1, 1);
insert into cities (name, break_out, in_king_county) values('Mercer Island', 1, 1);
insert into cities (name, break_out, in_king_county) values('Redmond', 1, 1);
insert into cities (name, break_out, in_king_county) values('Renton', 1, 1);
insert into cities (name, break_out, in_king_county) values('Sammamish', 1, 1);
insert into cities (name, break_out, in_king_county) values('SeaTac', 1, 1);
insert into cities (name, break_out, in_king_county) values('Shoreline', 1, 1);
insert into cities (name, break_out, in_king_county) values('Tukwila', 1, 1);
insert into cities (name, break_out, in_king_county) values('Seattle', 1, 1);

insert into cities (name, break_out, in_king_county)
  select distinct city, 0, 0
  from household
  where city not in (
    select name
    from cities)
  and city <> ''
  order by city;
