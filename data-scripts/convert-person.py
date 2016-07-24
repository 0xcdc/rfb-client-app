import json
import csv
import subprocess
cmd = 'mdb-export rfb.accdb Person'

csvrecords = subprocess.check_output(cmd, shell=True)
personreader = csv.reader(csvrecords.split("\n"))

keys = personreader.next()
keys = ["personId", "householdId", "firstName", "lastName", "disabled", "race", "birthYear", "gender",
        "refugeeImmigrantStatus", "speaksEnglish", "militaryStatus", "dateEntered", "enteredBy", "personNote"]
data = []

for row in personreader:
  kv = dict(zip(keys, row))
  if(len(kv) >0):
      data.append(kv)

print json.dumps(data, indent = 2)

