select case when city = "" then "Unknown" else city end as City, count(distinct householdId) "Unduplicated_Households", count(client.id) as "Unduplicated_Individuals"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city;
