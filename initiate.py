import sqlite3



class _innit_:

       
    def create_tables ():
        connection = sqlite3.connect('resources/railway.db') 
        database = connection.cursor()
        database.execute(f"""CREATE TABLE IF NOT EXISTS Stations(
                         id_station INTEGER PRIMARY KEY AUTOINCREMENT,
                         station_name STRING)""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Routes(
                         id_route INTEGER PRIMARY KEY AUTOINCREMENT,
                         route_name_short CHAR(7),
                         route_name STRING)""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Stops(
                         id_stop INT,
                         stop_number INT,
                         id_station STRING,
                         PRIMARY KEY(id_stop, stop_number))""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Schedule(
                         id_route INT,
                         stop_number INT,
                         course_number INT,
                         arrival_time STRING,
                         PRIMARY KEY(id_route, stop_number, course_number))""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Positions(
                         id_position INTEGER PRIMARY KEY AUTOINCREMENT,
                         position_name STRING,
                         salary FLOAT,
                         salary_allowance FLOAT)""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Employees(
                         id_employee INTEGER PRIMARY KEY AUTOINCREMENT,
                         name STRING,
                         surname STRING,
                         sex STRING,
                         date_of_birth STRING,
                         email STRING,
                         phone_number STRING,
                         id_position INT,
                         id_dcument INT,
                         id_train INT,
                         password STRING)""")
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
                         date_of_purchase STRING,
                         id_employeee INT,
                         station_name VARCHAR)""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Documents(
                         id_document INTEGER PRIMARY KEY AUTOINCREMENT,
                         document_name STRING,
                         discount DECIMAL)""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Passangers(
                         id_passanger INTEGER PRIMARY KEY AUTOINCREMENT,
                         name STRING,
                         surname STRING,
                         sex STRING,
                         date_of_birth STRING,
                         email STRING,
                         phone_number STRING,
                         id_document INT,
                         password STRING)""")
        connection.commit()

        database.execute(f"""CREATE TABLE IF NOT EXISTS Trains(
                         id_train INTEGER PRIMARY KEY AUTOINCREMENT,
                         train_model STRING,
                         id_route INT,
                         number_of_seats INT)""")
        connection.commit()
        connection.close()

_innit_.create_tables()
