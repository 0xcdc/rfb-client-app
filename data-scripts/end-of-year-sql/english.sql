with data as (
select case when city = "" then "Unknown" else city end as City,
	sum(case when speaksEnglish = 1 then 1 else 0 end) as "Speaks English Yes",
	sum(case when speaksEnglish = 0 then 1 else 0 end) as "speaks English No",
	sum(case when speaksEnglish = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)

select cities.id, 
  cities.name, 
  coalesce(data."Speaks English Yes", 0) as "Speaks English Yes",
  coalesce(data."speaks English No", 0) as "speaks English No",
  coalesce(data."Unknown", 0) as "Unknown"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC',   
  sum(data."Speaks English Yes"),
  sum(data."speaks English No"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', 
  sum(data."Speaks English Yes"),
  sum(data."speaks English No"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', 
  sum(data."Speaks English Yes"),
  sum(data."speaks English No"),
  sum(data."Unknown") as "Unknown"
from data  
where data.city = 'Unknown'
order by id;

