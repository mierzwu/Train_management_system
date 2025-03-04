const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const secretKey = 'example_key';

const app = express();
const port = 3333;

app.use(cors());
app.use(express.static(path.join(__dirname, 'website/sites')));
app.use(express.static(path.join(__dirname, 'website')));
app.use(bodyParser.json()); //obsługa json
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'example_email', //adres email
        pass: 'example_password' //hasło
    }
});

const DB = new sqlite3.Database('server/resources/railway.db', (err) => {
    if(err){
        console.error('Błąd połączenia z bazą danych:', err);
    } else {
        console.log('Połączono z bazą danych');
    }
});

//obsługa wyszukiwarki połączeń
app.post('/search', (req_search, res_search) => {
    const { from_station, to_station, date } = req_search.body;
    console.log("Received search data:", req_search.body);
    const DB_search = `
        SELECT Stations.station_name AS start_station_name, sc1.arrival_time AS time_of_start, st1.station_name AS destination, Schedule.arrival_time AS arrival_time, (sp1.stop_number - Stops.stop_number) AS number_of_stops, (strftime('%s', '2000-01-01 ' || Schedule.arrival_time) - strftime('%s', '2000-01-01 ' || sc1.arrival_time)) / 60 AS travel_time, Routes.route_name, Routes.id_route
        FROM Stations AS st1
        INNER JOIN (Routes
        INNER JOIN (Stops AS sp1
        INNER JOIN (((Stations
        INNER JOIN Stops ON Stations.id_station = Stops.id_station)
        INNER JOIN Schedule AS sc1 ON (Stops.id_stop = sc1.id_route) AND (Stops.stop_number = sc1.stop_number))
        INNER JOIN Schedule ON sc1.course_number = Schedule.course_number) ON (sp1.id_stop = Schedule.id_route) AND (sp1.stop_number = Schedule.stop_number)) ON Routes.id_route = sp1.id_stop) ON st1.id_station = sp1.id_station
        WHERE (((Stations.id_station) = ?) AND ((Stops.stop_number) < sp1.stop_number) AND ((sc1.arrival_time) > ?) AND ((st1.id_station) = ?) AND ((Stops.id_stop) = sp1.id_stop))
        ORDER BY 2, 5`;

    DB.all(DB_search, [from_station, date, to_station], (err, rows) => {
        if (err) {
            console.error('Query error:', err);
            res_search.status(500).send('Query error');
            return;
        }
        console.log('Search results sent successfully');
        res_search.json(rows);
    });
});

//obsługa rejestracji
app.post('/register', (req_register, res_register) => {
    console.log("dane rejestracji otrzymano pomyślnie:",req_register.body);
    const salt_rounds = 8;
    const { name, surname, sex, date_of_birth, email, phone_number, id_document, password, password1} = req_register.body;
    if(password == password1)
    {
        const DB_register = `
            INSERT INTO Passangers (name, surname, sex, date_of_birth, email, phone_number, id_document, password, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0);`;
        const DB_check_for_user = `
            SELECT id_passanger
            FROM Passangers
            WHERE (email = ?) OR (phone_number = ?);`
        DB.all(DB_check_for_user,[email, phone_number], (err,row) => {
            if (err) {
                console.error('Błąd zapytania:', err);
                return;
            } 
            if(row.toString() == "") //sprawdzenie czy użytkownik istnieje w bazie
            {
                const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
                const verificationUrl = `https://2f24xsbt-${port}.euw.devtunnels.ms/verify?token=${verificationToken}`;
                const meta = {//konstrukcja maila
                    from: 'finderofprofitablescaroffers@gmail.com',
                    to: email,
                    subject: 'Email Verification',
                    text: `Please verify your email by clicking the following link: ${verificationUrl}`
                };
                transporter.sendMail(meta, (err, info) => {//wysyłanie maila
                    if (err) {
                        return console.log('Error occurred:', err);
                    }
                    console.log('Email sent:', info.response);
                });

                bcrypt.hash(password, salt_rounds, (err, password_hashed) => {//hash do haseł
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res_register.status(500).send('Error hashing password');
                    }
                    DB.all(DB_register,[name, surname, sex, date_of_birth, email, phone_number, id_document, password_hashed], (err) => { //dodawanie do bazy
                        if (err) {
                           console.error('Błąd zapytania:', err);
                           res_register.status(500).send('Błąd zapytania');
                           return;
                        }
                        res_register.json({
                            message: "Registration successful! Please check your email to verify your account.",
                            color: "green"
                          });
                    });
                });
            }
            else{
                res_register.json({
                    message: "Registration error: user with that email or phone number is already in the database",
                    color: "red"
                  });
            }
        })
    }
    else{
        res_register.json({message: "Registration error: passwords must be idencical, try again"})
    }
});

// obsługa verify.html
app.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname, 'website/sites/verify.html'));
});

// obsługa weryfikacji
app.get('/verify_email', (req, res) => {
    const token = req.query.token;
    try {
        const decoded = jwt.verify(token, secretKey);
        const email = decoded.email;

        const DB_verify_user = `
        UPDATE Passangers
        SET verified = 1
        WHERE email = ?;`;

        DB.run(DB_verify_user, [email], (err) => {
            if (err) {
                console.error('Błąd zapytania:', err);
                return res.status(500).json({ message: 'Błąd zapytania' });
            }
            res.json({ message: 'Email verified successfully! You can now log in.', color: 'green' });
        });
    } catch (err) {
        console.error('Invalid or expired token:', err);
        res.status(400).json({ message: 'Invalid or expired token', color: 'red' });
    }
});

//obsługa loginu
app.post('/login', (req_login, res_login) => {
    console.log("dane logowania otrzymano pomyślnie:",req_login.body);
    const {login, password_login} = req_login.body;
    const DB_login_check = `
    SELECT password, id_passanger, id_document, verified
    FROM Passangers
    WHERE email = ?;`
    DB.all(DB_login_check,[login], (err,row) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res_login.json({ message: 'błędny email lub hasło' });
        } 
        if(row[0]==undefined)
        {
            res_login.json({message: "błędny email lub hasło"})
        }
        else if(row[0].verified == 0)
        {
            res_login.json({message: "account not verified, check email"})
        }
        else
        {
            bcrypt.compare(password_login, row[0].password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res_login.json({ message: 'Error comparing passwords' });
                }
                if (isMatch) {
                    const document = row[0].id_document;
                    const id_passanger = row[0].id_passanger;

                    // Check if the user is an admin
                    const DB_admin_check = `
                    SELECT email
                    FROM Employees
                    WHERE email = ?;`
                    DB.all(DB_admin_check, [login], (err, adminRow) => {
                        if (err) {
                            console.error('Błąd zapytania:', err);
                            return res_login.json({ message: 'Error checking admin status' });
                        }

                        let token;
                        if (adminRow.length > 0) {
                            // User is an admin
                            token = jwt.sign({ userId: id_passanger, isAdmin: true }, secretKey, { expiresIn: '1h' });
                        } else {
                            // User is not an admin
                            token = jwt.sign({ userId: id_passanger, isAdmin: false }, secretKey, { expiresIn: '1h' });
                        }

                        res_login.json({
                            message: "login successful",
                            token,
                            color: "green",
                            document
                        });
                    });
                } else {
                    res_login.json({ message: 'Błędny email lub hasło' });
                }
            });
        }
    });
});

//obsługa kupna biletu
app.post('/buy_ticket', (req_buy_ticket, res_buy_ticket) => {
    console.log('dane otrzymano kupna pomyślnie', req_buy_ticket.body);
    const { start_station_name, destination, travel_time, route_id, token, price, date_of_purchase } = req_buy_ticket.body;

    try {
        const decoded = jwt.verify(token, secretKey);
        const id_passanger = decoded.userId;
        console.log("Decoded token:", decoded);

        const DB_BUY_TICKET_USER_CHECK = `
            SELECT id_document
            FROM Passangers
            WHERE id_passanger = ?;`;

        DB.all(DB_BUY_TICKET_USER_CHECK, [id_passanger], (err, row) => {
            if (err) {
                console.error('Błąd zapytania:', err);
                res_buy_ticket.status(500).send('Błąd zapytania');
                return;
            }
            if (row.length === 0) {
                console.error('No user found with the given id_passanger');
                res_buy_ticket.status(404).send('No user found');
                return;
            }

            const id_document = row[0].id_document;
            console.log("User document ID:", id_document);

            const DB_BUY_TICKET = `
                INSERT INTO Tickets (id_passanger, document, start_station, end_station, id_route, travel_time, price, date_of_purchase)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

            DB.run(DB_BUY_TICKET, [id_passanger, id_document, start_station_name, destination, route_id, travel_time, price, date_of_purchase], (err) => {
                if (err) {
                    console.error('Błąd zapytania:', err);
                    res_buy_ticket.status(500).send('Błąd zapytania');
                    return;
                }
                res_buy_ticket.json({
                    message: "Ticket purchase successful!",
                    color: "green"
                });
            });
        });
    } catch (err) {
        console.error('Invalid token:', err);
        res_buy_ticket.status(401).send('Invalid token');
    }
});

//obsługa edycji profilu
app.post('/edit_profile_info', (req_edit_profile, res_edit_profile) => {
    console.log('Received profile edit data:', req_edit_profile.body);
    const salt_rounds = 8;
    const { name, surname, sex, date_of_birth, email, phone_number, id_document, password, password1, token } = req_edit_profile.body;
    const decoded = jwt.verify(token, secretKey);
    const id_passanger = decoded.userId;
    const DB_password_check = `
    SELECT password
    FROM Passangers
    WHERE id_passanger = ?;`; // Fix the SQL syntax error here
    DB.all(DB_password_check, [id_passanger], (err, row) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res_edit_profile.json({ message: 'błąd serwer, spróbuj ponownie później' });
        } 
        if (row[0] == undefined) {
            res_edit_profile.json({ message: "błąd autoryzacji" });
        } else {
            bcrypt.compare(password, row[0].password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res_edit_profile.json({ message: 'Error comparing passwords' });
                }
                if (isMatch) {
                    const DB_edit_profile = `
                    UPDATE Passangers
                    SET name = ?, surname = ?, sex = ?, date_of_birth = ?, email = ?, phone_number = ?, id_document = ?, password = ?
                    WHERE id_passanger = ?;`;
                    bcrypt.hash(password1, salt_rounds, (err, password_hashed) => {
                        if (err) {
                            console.error('Error hashing password:', err);
                            return res_edit_profile.json({ message: 'Error hashing password' });
                        }
                        DB.all(DB_edit_profile, [name, surname, sex, date_of_birth, email, phone_number, id_document, password_hashed, id_passanger], (err) => {
                            if (err) {
                                console.error('Błąd zapytania:', err);
                                res_edit_profile.json({ message: 'błąd serwer, spróbuj ponownie później' });
                                return;
                            }
                            res_edit_profile.json({
                                message: "Profil zaktualizowany",
                                color: "green"
                            });
                        });
                    });
                } else {
                    res_edit_profile.json({ message: 'błędne hasło, spróbuj jeszcze raz' });
                }
            });
        }
    });
});

// obsługa danych profilu
app.get('/get_profile_info', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const id_passanger = decoded.userId;

    const DB_get_profile_info = `
    SELECT name, surname, sex, date_of_birth, email, phone_number, id_document
    FROM Passangers
    WHERE id_passanger = ?;`;

    const DB_get_document_name=`
    SELECT document_name
    FROM Documents
    WHERE id_document = ?;`;
    DB.get(DB_get_profile_info, [id_passanger], (err, row) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ message: 'Błąd serwer, spróbuj ponownie później' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        DB.get(DB_get_document_name,row.id_document, (err, row1) => {
            if (err) {
                console.error('Błąd zapytania:', err);
                return res.status(500).json({ message: 'Błąd serwer, spróbuj ponownie później' });
            }
            if (!row1) {
                return res.status(404).json({ message: 'Nie znaleziono dokumentu' });
            }
            res.json({
                name: row.name,
                surname: row.surname,
                sex: row.sex,
                date_of_birth: row.date_of_birth,
                email: row.email,
                phone_number: row.phone_number,
                document_name: row1.document_name,
                isAdmin: decoded.isAdmin
              });
        });
    });
});

// Obsługa histrii podróży
app.get('/travel_history', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const id_passanger = decoded.userId;

    const DB_get_travel_history = `
    SELECT start_station, end_station, Routes.route_name, travel_time, price, date_of_purchase
    FROM Tickets
    INNER JOIN Routes ON Tickets.id_route = Routes.id_route
    WHERE id_passanger = ?;`;

    DB.all(DB_get_travel_history, [id_passanger], (err, rows) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ message: 'Błąd serwer, spróbuj ponownie później' });
        }
        res.json(rows);
    });
});

// obsługa statystyk
app.get('/get_statistics', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    if (!decoded.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const DB_most_used_routes = `
        SELECT Routes.route_name, COUNT(Tickets.id_route) AS count
        FROM Tickets
        INNER JOIN Routes ON Tickets.id_route = Routes.id_route
        GROUP BY Tickets.id_route
        ORDER BY count DESC
        LIMIT 5;`;

    const DB_most_used_documents = `
        SELECT Documents.document_name, COUNT(Tickets.document) AS count
        FROM Tickets
        INNER JOIN Documents ON Tickets.document = Documents.id_document
        GROUP BY Tickets.document
        ORDER BY count DESC
        LIMIT 5;`;

    DB.all(DB_most_used_routes, (err, routeRows) => {
        if (err) {
            console.error('Error fetching most used routes:', err);
            return res.status(500).json({ message: 'Error fetching most used routes' });
        }

        DB.all(DB_most_used_documents, (err, documentRows) => {
            if (err) {
                console.error('Error fetching most used documents:', err);
                return res.status(500).json({ message: 'Error fetching most used documents' });
            }

            res.json({
                mostUsedRoutes: routeRows,
                mostUsedDocuments: documentRows
            });
        });
    });
});

app.listen(port, () => {
    console.log('Serwer działa na porcie', port);
});


