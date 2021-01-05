with data as (
select *
  from city
  left join (
    select cityId,
      sum(case when incomeLevelId = 0 then 1 else 0 end) as "Unknown",
      sum(case when incomeLevelId = 1 then 1 else 0 end) as "<$24,000",
      sum(case when incomeLevelId = 2 then 1 else 0 end) as "$24,000 - <$40,000",
      sum(case when incomeLevelId = 3  then 1 else 0 end) as "$40,000 - <$64,000",
      sum(case when incomeLevelId = 4 then 1 else 0 end) as ">$64,000"
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
  coalesce(data.Unknown, 0) as Unknown,
  coalesce(data."<$24,000", 0) as "<$24,000",
  coalesce(data."$24,000 - <$40,000", 0) as "$24,000 - <$40,000",
  coalesce(data."$40,000 - <$64,000", 0) as "$40,000 - <$64,000",
  coalesce(data.">$64,000", 0) as ">$64,000"
from data
where break_out = 1
union all
select 100, 'Other KC', sum(data.Unknown), sum(data."<$24,000"), sum(data."$24,000 - <$40,000"),sum(data."$40,000 - <$64,000"),sum(data."$40,000 - <$64,000")
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC', sum(data.Unknown), sum(data."<$24,000"), sum(data."$24,000 - <$40,000"),sum(data."$40,000 - <$64,000"),sum(data."$40,000 - <$64,000")
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown', sum(data.Unknown), sum(data."<$24,000"), sum(data."$24,000 - <$40,000"),sum(data."$40,000 - <$64,000"),sum(data."$40,000 - <$64,000")
from data
where id = 0
order by id;
