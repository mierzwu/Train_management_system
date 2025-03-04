import sqlite3

       
connection = sqlite3.connect('server/resources/railway.db') 
database = connection.cursor()
database.execute(f"""CREATE TABLE IF NOT EXISTS Stations(
                         id_station INTEGER PRIMARY KEY AUTOINCREMENT,
                         station_name STRING)""")
connection.commit()
with open('resourcesTEST/Stations.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Stations (station_name)
                VALUES (?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Routes(
                         id_route INTEGER PRIMARY KEY AUTOINCREMENT,
                         route_name_short CHAR(7),
                         route_name STRING)""")
connection.commit()
with open('resourcesTEST/Routes.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")]) 
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Routes (route_name_short, route_name)
                VALUES (?, ?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Stops(
                         id_stop INT,
                         stop_number INT,
                         id_station STRING,
                         PRIMARY KEY(id_stop, stop_number))""")
connection.commit()
with open('resourcesTEST/Stops.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")]) 
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Stops (id_stop, stop_number, id_station)
                VALUES (?, ?, ?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Schedule(
                         id_route INT,
                         stop_number INT,
                         course_number INT,
                         arrival_time TIME,
                         PRIMARY KEY(id_route, stop_number, course_number))""")
connection.commit()
with open('resourcesTEST/Schedule.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Schedule
                VALUES (?, ?, ?, ?)
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Positions(
                         id_position STRING PRIMARY KEY,
                         position_name STRING,
                         salary FLOAT,
                         salary_allowance FLOAT)""")
connection.commit()
with open('resourcesTEST/Positions.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Positions (id_position, position_name, salary, salary_allowance)
                VALUES (?, ?, ?, ?)
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Employees(
                         email STRING
                         )""")
connection.commit()
with open('resourcesTEST/Employees.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Employees (email)
                VALUES (?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Tickets(
                         id_ticket INTEGER PRIMARY KEY AUTOINCREMENT, 
                         id_passanger INTAGER,
                         document STRING,
                         start_station STRING,
                         end_station STING,
                         id_route INT,
                         travel_time STRING,
                         price FLOAT,
                         date_of_purchase STRING
                )""")
connection.commit()
with open('resourcesTEST/Tickets.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Tickets (id_passanger, document, start_station, end_station, id_route, travel_time, price, date_of_purchase)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Documents(
                         id_document STRING PRIMARY KEY,
                         document_name STRING,
                         discount DECIMAL)""")
connection.commit()
with open('resourcesTEST/Documents.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Documents (id_document, document_name, discount)
                VALUES (?, ?, ?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Passangers(
                         id_passanger INTEGER PRIMARY KEY AUTOINCREMENT,
                         name STRING,
                         surname STRING,
                         sex CHAR,
                         date_of_birth STRING,
                         email STRING,
                         phone_number STRING,
                         id_document STRING,
                         password STRING,
                         verified BOOLEAN DEFAULT FALSE)""")
connection.commit()
with open('resourcesTEST/Passangers.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Passangers (name, surname, sex, date_of_birth, email, phone_number, id_document, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, row)
        
connection.commit()

database.execute(f"""CREATE TABLE IF NOT EXISTS Trains(
                         id_train INTEGER PRIMARY KEY AUTOINCREMENT,
                         train_model STRING,
                         id_route INT,
                         number_of_seats INT)""")
connection.commit()
with open('resourcesTEST/Trains.csv','r') as file:
    data = []
    for row in file:
        data.append([value.strip() for value in row.split(";")])
    data = data[1::]
    for row in data:
        database.execute(f"""
                INSERT INTO Trains (train_model, id_route, number_of_seats)
                VALUES (?, ?, ?)
            """, row)
        
connection.commit()

#DO SELECT


connection.close()
print("DATABASE_DEMO IS READY TO USE")