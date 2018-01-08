select case when city = "" then "Unknown" else city end as City,
	sum(case when gender = "Male" then 1 else 0 end) as "Male",
	sum(case when gender = "Female" then 1 else 0 end) as "Female",
	sum(case when gender = "Transgendered" then 1 else 0 end) as "Transgendered", 
	sum(case when gender = "" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city;