with data as (
select *
  from city
  left join (
    select cityId,
      sum(case when address1 = "" then 1 else 0 end) as "Homeless",
      sum(case when address1 <> "" then 1 else 0 end) as "Not Homeless"
    from households_visited_last_year
    join household
      on household.id = households_visited_last_year.id and
         household.version = households_visited_last_year.version
    group by cityId
  ) d
  on city.id = d.cityId
)
select id,
  name,
  coalesce(data."Homeless", 0) as "Homeless",
  coalesce(data."Not Homeless", 0) as "Not Homeless"
from data
where break_out = 1
union all
select 100, 'Other KC', sum(data.Homeless), sum(data."Not Homeless")
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC', sum(data.Homeless), sum(data."Not Homeless")
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown', sum(data.Homeless), sum(data."Not Homeless")
from data
where id = 0
order by id;
