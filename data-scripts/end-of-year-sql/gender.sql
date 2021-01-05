with data as (
select *
  from city
  left join (
    select cityId,
      sum(case when genderId = 2 then 1 else 0 end) as "Male",
      sum(case when genderId = 1 then 1 else 0 end) as "Female",
      sum(case when genderId = 3 then 1 else 0 end) as "Transgendered",
      sum(case when genderId = 0 then 1 else 0 end) as "Unknown"
    from households_visited_last_year
    join household
      on household.id = households_visited_last_year.id and
         household.version = households_visited_last_year.version
    left join household_client_list hcl
      on household.id = hcl.householdId and
         household.version = hcl.householdVersion
    left join client
      on client.id= hcl.clientId and
         client.version = hcl.clientVersion
    group by cityId
  ) d
  on city.id = d.cityId
)
select id,
  name,
  coalesce(data."Male", 0) as "Male",
  coalesce(data."Female", 0) as "Female",
  coalesce(data."Transgendered", 0) as "Transgendered",
  coalesce(data."Unknown", 0) as "Unknown"
from data
where break_out = 1
union all
select 100, 'Other KC',
  sum(data."Male"),
  sum(data."Female"),
  sum(data."Transgendered"),
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC',
  sum(data."Male"),
  sum(data."Female"),
  sum(data."Transgendered"),
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown',
  sum(data."Male"),
  sum(data."Female"),
  sum(data."Transgendered"),
  sum(data."Unknown") as "Unknown"
from data
where id = 0
order by id;
