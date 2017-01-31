import sqlite3
import re
from datetime import datetime, timedelta

pacific = timedelta(hours=-8)

conn = sqlite3.connect('database.sqlite')

#we have dates in two different formats,
#we want to first normalize them into YYYY-MM-DD

rows = conn.execute('SELECT id, date FROM visit')
for row in rows:
    (id, date) = row

    print [id, date]

    #format we want is YYYY-MM-DD
    goodFormat = re.compile('\d\d\d\d-\d\d-\d\d')
    goodFormatMatch = goodFormat.match(date)

    #format 1 is mm/dd/yy 00:00:00
    format1 = re.compile('(\d\d)/(\d\d)/(\d\d) 00:00:00')
    match1 = format1.match(date)

    if(goodFormatMatch):
        continue
    elif(match1):
        day = match1.group(2)
        month = match1.group(1)
        year = match1.group(3)
        date = "20" + year + "-" + month + "-" + day
    else:
        #it's UTC formatted by javascript
        date = datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z")
        #get it back to pacific
        date += pacific

        date = date.date().isoformat()

    conn.execute('UPDATE visit SET date = ? WHERE id = ?', [date, id])

conn.commit()

