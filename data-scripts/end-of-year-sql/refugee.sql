with data as (select case when city = "" then "Unknown" else city end as City,
	sum(case when refugeeImmigrantStatus = 1 then 1 else 0 end) as "Refugee / Immigrant Yes",
	sum(case when refugeeImmigrantStatus = 0 then 1 else 0 end) as "Refugee / Immigrant No",
	sum(case when refugeeImmigrantStatus = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)


select cities.id, 
  cities.name, 
  coalesce(data."Refugee / Immigrant Yes", 0) as "Refugee / Immigrant Yes",
  coalesce(data."Refugee / Immigrant No", 0) as "Refugee / Immigrant No",
  coalesce(data."Unknown", 0) as "Unknown"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC',   
  sum(data."Refugee / Immigrant Yes"),
  sum(data."Refugee / Immigrant No"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', 
  sum(data."Refugee / Immigrant Yes"),
  sum(data."Refugee / Immigrant No"),
  sum(data."Unknown") as "Unknown"
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', 
  sum(data."Refugee / Immigrant Yes"),
  sum(data."Refugee / Immigrant No"),
  sum(data."Unknown") as "Unknown"
from data  
where data.city = 'Unknown'
order by id;


