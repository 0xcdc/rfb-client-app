select case when city = "" then "Unknown" else city end as City, 
  sum(case when age >= 0 and age <= 5 then 1 else 0 end) as "0 - 5",
  sum(case when age >= 6 and age <= 12 then 1 else 0 end) as "6 - 12",
  sum(case when age >= 13 and age <= 17 then 1 else 0 end) as "13 - 17",
  sum(case when age >= 18 and age <= 24 then 1 else 0 end) as "18 - 24",
  sum(case when age >= 25 and age <= 34 then 1 else 0 end) as "25 - 34",
  sum(case when age >= 35 and age <= 54 then 1 else 0 end) as "35 - 54",
  sum(case when age >= 55 and age <= 74 then 1 else 0 end) as "55 - 74", 
  sum(case when age >= 75 and age <= 84 then 1 else 0 end) as "74 - 85",
  sum(case when age >= 85 then 1 else 0 end) as "85+",
  sum(case when age is null then 1 else 0 end) as Unknown  
from (
	select city, cast(case when birthyear != "" then strftime('%Y', 'now') - birthyear else null end as int) as age
	from households_visited_last_year 
	join household
	  on household.id = households_visited_last_year.id
	join client 
	  on client.householdId = household.id
)
group by city;



