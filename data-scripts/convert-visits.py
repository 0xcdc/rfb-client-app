import json
import csv
import subprocess
import sys
import datetime

cmd = 'mdb-export rfb.accdb Visit'

csvrecords = subprocess.check_output(cmd, shell=True)
personreader = csv.reader(csvrecords.split("\n"))

keys = personreader.next()
#Visit ID,Household ID,Notes,Visit Date,DateEntered,EnteredBy
keys = ["id", "householdId", "notes", "date", "dateEntered", "enteredBy"]
outputKeys = ["id", "date", "createdAt", "updatedAt", "householdId"]
 
data = []

for row in personreader:
    kv = dict(zip(keys, row))

    if(len(kv) > 0):
        kv["createdAt"] = datetime.datetime.now()
        kv["updatedAt"] = datetime.datetime.now()

        dataRow = []
        for key in outputKeys:
          dataRow.append(kv[key]);

        data.append(dataRow);

csvwriter = csv.writer(sys.stdout)
csvwriter.writerows(data);

