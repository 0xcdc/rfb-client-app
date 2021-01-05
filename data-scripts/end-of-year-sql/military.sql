with data as (
select *
  from city
  left join (
    select cityId,
      sum(case when militaryStatusId = 2 then 1 else 0 end) as "US Military Service (past or present)",
      sum(case when militaryStatusId = 3 then 1 else 0 end) as "Partners of persons with active military service",
      sum(case when militaryStatusId = 1 then 1 else 0 end) as "None",
      sum(case when militaryStatusId = 0 then 1 else 0 end) as "Unknown"
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
  coalesce(data."US Military Service (past or present)", 0) as "US Military Service (past or present)",
  coalesce(data."Partners of persons with active military service", 0) as "Partners of persons with active military service",
  coalesce(data."None", 0) as "None",
  coalesce(data."Unknown", 0) as "Unknown"
from data
where break_out = 1
union all
select 100, 'Other KC',
  sum(data."US Military Service (past or present)"),
  sum(data."Partners of persons with active military service"),
  sum(data."None"),
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC',
  sum(data."US Military Service (past or present)"),
  sum(data."Partners of persons with active military service"),
  sum(data."None"),
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown',
  sum(data."US Military Service (past or present)"),
  sum(data."Partners of persons with active military service"),
  sum(data."None"),
  sum(data."Unknown") as "Unknown"
from data
where id = 0
order by id;

