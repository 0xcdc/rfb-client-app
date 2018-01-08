select case when city = "" then "Unknown" else city end as City,
	sum(case when race = "Indian-American or Alaskan-Native" then 1 else 0 end) as "Indian-American or Alaskan-Native",
	sum(case when race = "Asian, Asian-American" then 1 else 0 end) as "Asian, Asian-American",
	sum(case when race = "Black, African-American, Other African" then 1 else 0 end) as "Black, African-American, Other African",
	sum(case when race = "Latino, Latino American, Hispanic" then 1 else 0 end) as "Latino, Latino American, Hispanic",
	sum(case when race = "Hawaiian-Native or Pacific Islander" then 1 else 0 end) as "Hawaiian-Native or Pacific Islander",
	sum(case when race = "White or Caucasian" then 1 else 0 end) as "White or Caucasian",
	sum(case when race = "Other Race" then 1 else 0 end) as "Other Race",
	sum(case when race = "Multi-Racial (2+ identified)" then 1 else 0 end) as "Multi-Racial (2+ identified)",
	sum(case when race = "" or race = "Unknown" then 1 else 0 end) as "Unknown"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city;
