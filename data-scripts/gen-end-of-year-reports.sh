for i in end-of-year-sql/*.sql; do
  sqlite3 ../database.sqlite -header -csv < $i > $i.csv
done;

ssconvert --merge-to=all.xls end-of-year-sql/*.csv

