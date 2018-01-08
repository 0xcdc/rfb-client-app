select case when city = "" then "Unknown" else city end as City, 
	sum(case when income = "" then 1 else 0 end) as "Unknown",
	sum(case when income = "<$24,000" then 1 else 0 end) as "<$24,000",
	sum(case when income = "$24,000 - <$40,000" then 1 else 0 end) as "$24,000 - <$40,000",
	sum(case when income = "$40,000 - <$64,000" then 1 else 0 end) as "$40,000 - <$64,000",
	sum(case when income = ">$64,000" then 1 else 0 end) as ">$64,000"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
group by city;
