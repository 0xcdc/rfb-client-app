with data as (
select *
  from city
  left join (
    select cityId,
      sum(case when raceId = 5 then 1 else 0 end) as "Indian-American or Alaskan-Native",
      sum(case when raceId = 1 then 1 else 0 end) as "Asian, Asian-American",
      sum(case when raceId = 2 then 1 else 0 end) as "Black, African-American, Other African",
      sum(case when raceId = 3 then 1 else 0 end) as "Latino, Latino American, Hispanic",
      sum(case when raceId = 4 then 1 else 0 end) as "Hawaiian-Native or Pacific Islander",
      sum(case when raceId = 6 then 1 else 0 end) as "White or Caucasian",
      sum(case when raceId = 7 then 1 else 0 end) as "Other Race",
      sum(case when raceId = 8 then 1 else 0 end) as "Multi-Racial (2+ identified)",
      sum(case when raceId = 0 then 1 else 0 end) as "Unknown"
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
  coalesce(data."Indian-American or Alaskan-Native", 0) as "Indian-American or Alaskan-Native",
  coalesce(data."Asian, Asian-American", 0) as "Asian, Asian-American",
  coalesce(data."Black, African-American, Other African", 0) as "Black, African-American, Other African",
  coalesce(data."Latino, Latino American, Hispanic", 0) as "Latino, Latino American, Hispanic",
  coalesce(data."Hawaiian-Native or Pacific Islander", 0) as "Hawaiian-Native or Pacific Islander",
  coalesce(data."White or Caucasian", 0) as "White or Caucasian",
  coalesce(data."Other Race", 0) as "Other Race",
  coalesce(data."Multi-Racial (2+ identified)", 0) as "Multi-Racial (2+ identified)",
  coalesce(data."Unknown", 0) as "Unknown"
from data
where break_out = 1
union all
select 100, 'Other KC',
  sum(data."Indian-American or Alaskan-Native"),
  sum(data."Asian, Asian-American"),
  sum(data."Black, African-American, Other African"),
  sum(data."Latino, Latino American, Hispanic"),
  sum(data."Hawaiian-Native or Pacific Islander"),
  sum(data."White or Caucasian"),
  sum(data."Other Race"),
  sum(data."Multi-Racial (2+ identified)"),
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC',
  sum(data."Indian-American or Alaskan-Native"),
  sum(data."Asian, Asian-American"),
  sum(data."Black, African-American, Other African"),
  sum(data."Latino, Latino American, Hispanic"),
  sum(data."Hawaiian-Native or Pacific Islander"),
  sum(data."White or Caucasian"),
  sum(data."Other Race"),
  sum(data."Multi-Racial (2+ identified)"),
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown',
  sum(data."Indian-American or Alaskan-Native"),
  sum(data."Asian, Asian-American"),
  sum(data."Black, African-American, Other African"),
  sum(data."Latino, Latino American, Hispanic"),
  sum(data."Hawaiian-Native or Pacific Islander"),
  sum(data."White or Caucasian"),
  sum(data."Other Race"),
  sum(data."Multi-Racial (2+ identified)"),
  sum(data."Unknown") as "Unknown"
from data
where id = 0
order by id;
