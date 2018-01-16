with data as (
select case when city = "" then 'Unknown' else city end as City, 
	sum(case when address1 = "" then 1 else 0 end) as "Homeless",
	sum(case when address1 <> "" then 1 else 0 end) as "Not Homeless"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)

select cities.id, 
  cities.name, 
  coalesce(data."Homeless", 0) as "Homeless",
  coalesce(data."Not Homeless", 0) as "Not Homeless"
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC', sum(data.Homeless), sum(data."Not Homeless")
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', sum(data.Homeless), sum(data."Not Homeless")
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', sum(data.Homeless), sum(data."Not Homeless")
from data  
where data.city = 'Unknown'
order by id;
