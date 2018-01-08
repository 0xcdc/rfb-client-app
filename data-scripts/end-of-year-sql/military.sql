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
group by city;

