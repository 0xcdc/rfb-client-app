select case when city = "" then "Unknown" else city end as City,
	sum(case when disabled = 0 then 1 else 0 end) as "Disabilities No",
	sum(case when disabled = 1 then 1 else 0 end) as "Disabilities Yes",
	sum(case when disabled = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city;