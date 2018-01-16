with data as (
select case when city = "" then "Unknown" else city end as City,
	sum(case when disabled = 0 then 1 else 0 end) as "Disabilities No",
	sum(case when disabled = 1 then 1 else 0 end) as "Disabilities Yes",
	sum(case when disabled = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)


select cities.id, 
  cities.name, 
  coalesce(data."Disabilities No", 0) as "Disabilities No",
  coalesce(data."Disabilities Yes", 0) as "Disabilities Yes",
  coalesce(data."Unknown", 0) as "Unknown"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC',   
  sum(data."Disabilities No"),
  sum(data."Disabilities Yes"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', 
  sum(data."Disabilities No"),
  sum(data."Disabilities Yes"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', 
  sum(data."Disabilities No"),
  sum(data."Disabilities Yes"),
  sum(data."Unknown") as "Unknown"
from data  
where data.city = 'Unknown'
order by id;