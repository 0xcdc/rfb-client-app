select case when city = "" then "Unknown" else city end as City, 
	sum(case when address1 = "" then 1 else 0 end) as "Homeless",
	sum(case when address1 <> "" then 1 else 0 end) as "Not Homeless"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city;