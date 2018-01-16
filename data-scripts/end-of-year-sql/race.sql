with data as (
select case when city = "" then "Unknown" else city end as City,
	sum(case when race = "Indian-American or Alaskan-Native" then 1 else 0 end) as "Indian-American or Alaskan-Native",
	sum(case when race = "Asian, Asian-American" then 1 else 0 end) as "Asian, Asian-American",
	sum(case when race = "Black, African-American, Other African" then 1 else 0 end) as "Black, African-American, Other African",
	sum(case when race = "Latino, Latino American, Hispanic" then 1 else 0 end) as "Latino, Latino American, Hispanic",
	sum(case when race = "Hawaiian-Native or Pacific Islander" then 1 else 0 end) as "Hawaiian-Native or Pacific Islander",
	sum(case when race = "White or Caucasian" then 1 else 0 end) as "White or Caucasian",
	sum(case when race = "Other Race" then 1 else 0 end) as "Other Race",
	sum(case when race = "Multi-Racial (2+ identified)" then 1 else 0 end) as "Multi-Racial (2+ identified)",
	sum(case when race = "" or race = "Unknown" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)



select cities.id, 
  cities.name, 
  coalesce(data."Indian-American or Alaskan-Native", 0) as "Indian-American or Alaskan-Native",
  coalesce(data."Asian, Asian-American", 0) as "Asian, Asian-American",
  coalesce(data."Black, African-American, Other African", 0) as "Black, African-American, Other African",
  coalesce(data."Latino, Latino American, Hispanic", 0) as "Latino, Latino American, Hispanic",
  coalesce(data."Hawaiian-Native or Pacific Islander", 0) as "Hawaiian-Native or Pacific Islander",
  coalesce(data."White or Caucasian", 0) as "White or Caucasian",
  coalesce(data."Other Race", 0) as "Other Race",
  coalesce(data."Multi-Racial (2+ identified)", 0) as "Multi-Racial (2+ identified)",
  coalesce(data."Unknown", 0) as "Unknown"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
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
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
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
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
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
where data.city = 'Unknown'
order by id;