import sqlite3

connection = sqlite3.connect('server/resources/railway.db') 
database = connection.cursor()

database.execute(f"""SELECT * 
                 FROM Passangers;
""")
connection.commit()
data = database.fetchall()
i=0
for row in data:
    i=i+1
    print(i,row)
connection.close()
#test