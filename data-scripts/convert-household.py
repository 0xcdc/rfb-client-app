import json
import csv
import subprocess
cmd = 'mdb-export rfb.accdb Household'

csvrecords = subprocess.check_output(cmd, shell=True)
personreader = csv.reader(csvrecords.split("\n"))

keys = personreader.next()
#Household ID,Address 1,Address 2,City,State,Zip,Income,Household Size,Note,OldHouseholdID,DateEntered,EnteredBy
keys = ["householdId", "address1", "address2", "city", "state", "zip", "income", "householdSize", "note",
        "oldHouseholdId", "dateEntered", "enteredBy"]
data = []

income = {
         "1":"<$24,000",
         "2":"$24,000 - <$40,000",
         "3":"$40,000 - <$64,000",
         "4":">$64,000",
         }

for row in personreader:
    kv = dict(zip(keys, row))

    if(len(kv) > 0):
        if(kv["income"] in income):
            kv["income"] = income[kv["income"]]

        #we want to calculate householdSize instead of using the serialized value - it is wrong a lot
        kv.pop("householdSize", None)

        data.append(kv)


print json.dumps(data, indent = 2)

