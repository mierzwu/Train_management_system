document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    document.querySelector('.logout-link').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = "index.html";
    });

    fetch('/get_profile_info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.isAdmin) {
            document.getElementById('statisticsBtn').style.display = 'block';
        }
    })
    .catch(error => console.error('Error fetching profile info:', error));

    document.getElementById('editProfileBtn').addEventListener('click', () => {
        fetch('/get_profile_info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('profileContent').innerHTML = `
                <div class="profile-info">
                    <h3>Current Profile Info</h3>
                    <form>
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Surname:</strong> ${data.surname}</p>
                        <p><strong>Sex:</strong> ${data.sex}</p>
                        <p><strong>Date of Birth:</strong> ${data.date_of_birth}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Phone Number:</strong> ${data.phone_number}</p>
                        <p><strong>Document:</strong> ${data.document_name}</p>
                        </form>
                </div>
                <div class="edit-profile-form">
                    <h3>Edit Profile Info</h3>
                    <form id="editProfileForm">
                        <p>
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" value="${data.name}" required>
                        </p>
                        <p>
                            <label for="surname">Surname</label>
                            <input type="text" id="surname" name="surname" value="${data.surname}" required>
                        </p>
                        <p>
                            <label for="sex">Sex</label>
                            <input type="radio" id="M" name="sex" value="M" ${data.sex === 'M' ? 'checked' : ''} required>
                            <label for="male">Male</label>
                            <input type="radio" id="K" name="sex" value="K" ${data.sex === 'K' ? 'checked' : ''} required>
                            <label for="female">Female</label>
                        </p>
                        <p>
                            <label for="date_of_birth">Date of Birth</label>
                            <input type="date" id="date_of_birth" name="date_of_birth" value="${data.date_of_birth}" required>
                        </p>
                        <p>
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" value="${data.email}" required>
                        </p>
                        <p>
                            <label for="phone_number">Phone Number</label>
                            <input type="tel" id="phone_number" name="phone_number" value="${data.phone_number}" required>
                        </p>
                        <p>
                           <iframe src="../sites/document.html" style="border:none;"></iframe>
                        </p>
                        <p>
                            <label for="password">Old password</label>
                            <input type="password" id="password" name="password" required>
                        </p>
                        <p>
                            <label for="password1">New password</label>
                            <input type="password" id="password1" name="password1" required>
                        </p>
                        <p>
                            <button type="submit">Save Changes</button>
                        </p>
                    </form>
                    <div id="responseMessage" style="margin-top: 20px;"></div>
                </div>
            `;

            document.getElementById('editProfileForm').addEventListener('submit', event => {
                event.preventDefault(); // Prevent default form submission

                const name = document.getElementById('name').value;
                const surname = document.getElementById('surname').value;
                const sex = document.querySelector('input[name="sex"]:checked').value;
                const date_of_birth = document.getElementById('date_of_birth').value;
                const email = document.getElementById('email').value;
                const phone_number = document.getElementById('phone_number').value;
                
                //iframe wymaga specjalnego dostępu
                const iframe = document.querySelector('iframe');
                let id_document = null;
                if (iframe && iframe.contentDocument) {
                    const iframeDoc = iframe.contentDocument;
                    id_document = iframeDoc.getElementById('id_document').value; 
                }
                const token = localStorage.getItem('token');
                const password = document.getElementById('password').value;
                const password1 = document.getElementById('password1').value;
                const edit_profile_form = { name, surname, sex, date_of_birth, email, phone_number, id_document, password, password1, token };
            
                fetch('/edit_profile_info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(edit_profile_form)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Dane zostały wysłane:", data); //tu
                    if(data.color == undefined) {
                        displayResponseMessage(data.message, "red");
                    } else {
                        displayResponseMessage(data.message+" odśwież strone", data.color);
                    }
                })
                .catch(error => console.error('Error during profile update:', error));
            });
        })
        .catch(error => console.error('Error fetching profile info:', error));
    });

    document.getElementById('travelHistoryBtn').addEventListener('click', () => {
        fetch('/travel_history', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let historyHtml = `
                <h3>Tickets history</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Start Station</th>
                            <th>End Station</th>
                            <th>Route</th>
                            <th>Travel Time(min)</th>
                            <th>Price(zł)</th>
                            <th>Date of Purchase</th>
                        </tr>
                    </thead>
                    <tbody>`;
            data.forEach(ticket => {
                historyHtml += `
                    <tr>
                        <td>${ticket.start_station}</td>
                        <td>${ticket.end_station}</td>
                        <td>${ticket.route_name}</td>
                        <td>${ticket.travel_time}</td>
                        <td>${ticket.price}</td>
                        <td>${ticket.date_of_purchase}</td>
                    </tr>`;
            });
            historyHtml += `
                    </tbody>
                </table>`;
            document.getElementById('profileContent').innerHTML = historyHtml;
        })
        .catch(error => console.error('Error fetching travel history:', error));
    });

    document.getElementById('statisticsBtn').addEventListener('click', () => {
        window.location.href = "statistics.html"; // Redirect to statistics page
    });
});

function updateTime() {
    const now = new Date();
    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-EN', options);

    timeElement.textContent = now.toLocaleTimeString('en-EN');
}

function displayResponseMessage(message, color) {
    const responseElement = document.getElementById('responseMessage');  // Get the div
    if (responseElement) {
        responseElement.textContent = message;  // Set the message text
        responseElement.style.color = color;    // Set the text color (green for success, red for error)
    } else {
        console.error("Response element not found!");
    }
}
