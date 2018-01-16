with data as (
select case when city = "" then "Unknown" else city end as City,
	sum(case when militaryStatus = "US Military Service (past or present)" then 1 else 0 end) as "US Military Service (past or present)",
	sum(case when militaryStatus = "Partners of persons with active military service" then 1 else 0 end) as "Partners of persons with active military service",
	sum(case when militaryStatus = "None" then 1 else 0 end) as "None",
	sum(case when militaryStatus = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)

select cities.id, 
  cities.name, 
  coalesce(data."US Military Service (past or present)", 0) as "US Military Service (past or present)",
  coalesce(data."Partners of persons with active military service", 0) as "Partners of persons with active military service",
  coalesce(data."None", 0) as "None",
  coalesce(data."Unknown", 0) as "Unknown"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC',   
  sum(data."US Military Service (past or present)"),
  sum(data."Partners of persons with active military service"),
  sum(data."None"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', 
  sum(data."US Military Service (past or present)"),
  sum(data."Partners of persons with active military service"),
  sum(data."None"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', 
  sum(data."US Military Service (past or present)"),
  sum(data."Partners of persons with active military service"),
  sum(data."None"),
  sum(data."Unknown") as "Unknown"
from data  
where data.city = 'Unknown'
order by id;

