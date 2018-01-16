with data as (
select case when city = "" then "Unknown" else city end as City, count(distinct householdId) "Unduplicated_Households", count(client.id) as "Unduplicated_Individuals"
from households_visited_last_year 
join household
  on household.id = households_visited_last_year.id
join client 
  on client.householdId = household.id
group by city)

select cities.id, 
  cities.name, 
  coalesce(data.Unduplicated_Households, 0) as Unduplicated_Households, 
  coalesce(data.Unduplicated_Individuals, 0) as Unduplicated_Individuals
from cities
left join data
  on cities.name = data.city
where cities.break_out = 1
union all
select 100, 'Other KC', sum(data.Unduplicated_Households), sum(data.Unduplicated_Individuals)
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 1
union all
select 101, 'Outside KC', sum(data.Unduplicated_Households), sum(data.Unduplicated_Individuals)
from cities 
left join data
  on cities.name = data.city
where cities.break_out = 0 and cities.in_king_county = 0
union all
select 102, 'Unknown', sum(data.Unduplicated_Households), sum(data.Unduplicated_Individuals)
from data  
where data.city = 'Unknown'
order by id;