drop table households_visited_last_year ;
create table households_visited_last_year (id int primary key);

delete from households_visited_last_year;

insert into households_visited_last_year
select distinct householdId as id from visit where date > '2019-01-01' and date < '2020-01-01'
