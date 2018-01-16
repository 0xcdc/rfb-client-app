with data as (
select case when city = "" then 'Unknown' else city end as City, 
	sum(case when income = "" then 1 else 0 end) as "Unknown",
	sum(case when income = "<$24,000" then 1 else 0 end) as "<$24,000",
	sum(case when income = "$24,000 - <$40,000" then 1 else 0 end) as "$24,000 - <$40,000",
	sum(case when income = "$40,000 - <$64,000" then 1 else 0 end) as "$40,000 - <$64,000",
	sum(case when income = ">$64,000" then 1 else 0 end) as ">$64,000"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
group by city)

select cities.id, 
  cities.name, 
  coalesce(data.Unknown, 0) as Unknown, 
  coalesce(data."<$24,000", 0) as "<$24,000",
  coalesce(data."$24,000 - <$40,000", 0) as "$24,000 - <$40,000",
  coalesce(data."$40,000 - <$64,000", 0) as "$40,000 - <$64,000",
  coalesce(data.">$64,000", 0) as ">$64,000"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC', sum(data.Unknown), sum(data."<$24,000"), sum(data."$24,000 - <$40,000"),sum(data."$40,000 - <$64,000"),sum(data."$40,000 - <$64,000")
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', sum(data.Unknown), sum(data."<$24,000"), sum(data."$24,000 - <$40,000"),sum(data."$40,000 - <$64,000"),sum(data."$40,000 - <$64,000")
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', sum(data.Unknown), sum(data."<$24,000"), sum(data."$24,000 - <$40,000"),sum(data."$40,000 - <$64,000"),sum(data."$40,000 - <$64,000")
from data  
where data.city = 'Unknown'
order by id;