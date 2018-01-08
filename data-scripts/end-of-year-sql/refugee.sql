select case when city = "" then "Unknown" else city end as City,
	sum(case when refugeeImmigrantStatus = 1 then 1 else 0 end) as "Refugee / Immigrant Yes",
	sum(case when refugeeImmigrantStatus = 0 then 1 else 0 end) as "Refugee / Immigrant No",
	sum(case when refugeeImmigrantStatus = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city;


