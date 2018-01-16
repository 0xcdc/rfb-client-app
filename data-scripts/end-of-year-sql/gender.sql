with data as (select case when city = "" then "Unknown" else city end as City,
	sum(case when gender = "Male" then 1 else 0 end) as "Male",
	sum(case when gender = "Female" then 1 else 0 end) as "Female",
	sum(case when gender = "Transgendered" then 1 else 0 end) as "Transgendered", 
	sum(case when gender = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)

select cities.id, 
  cities.name, 
  coalesce(data."Male", 0) as "Male",
  coalesce(data."Female", 0) as "Female",
  coalesce(data."Transgendered", 0) as "Transgendered",
  coalesce(data."Unknown", 0) as "Unknown"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC',   
  sum(data."Male"),
  sum(data."Female"),
  sum(data."Transgendered"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', 
  sum(data."Male"), 
  sum(data."Female"),
  sum(data."Transgendered"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', 
  sum(data."Male"), 
  sum(data."Female"), 
  sum(data."Transgendered"),
  sum(data."Unknown") as "Unknown"
from data  
where data.city = 'Unknown'
order by id;