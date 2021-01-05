drop table households_visited_last_year ;
create table households_visited_last_year (id int primary key, version int);

delete from households_visited_last_year;

insert into households_visited_last_year
  select householdId as id, householdVersion as version
    from visit v1
    where date >='2020-01-01' and date < '2021-01-01'
      and not exists (
        select *
        from visit v2
        where v2.householdId = v1.householdId
          and v2.date >= '2020-01-01' and v2.date < '2021-01-01'
          and v2.date > v1.date
      )
