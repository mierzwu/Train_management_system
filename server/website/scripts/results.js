document.addEventListener('DOMContentLoaded', () => {
    const resultsTableBody = document.getElementById('resultsTable').querySelector('tbody');
    const searchData = JSON.parse(localStorage.getItem('searchData'));
    console.log("Search data retrieved:", searchData);

    if (searchData) {
        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Search results received:", data);
            data.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.start_station_name}</td>
                    <td>${result.time_of_start}</td>
                    <td>${result.destination}</td>
                    <td>${result.arrival_time}</td>
                    <td>${result.number_of_stops}</td>
                    <td>${result.travel_time}</td>
                    <td>${result.route_name}</td>
                    <td><button class="buy-ticket" data-route-id="${result.id_route}">Buy Ticket</button></td>
                `;
                resultsTableBody.appendChild(row);
            });

            // Add event listeners to the "Buy Ticket" buttons
            document.querySelectorAll('.buy-ticket').forEach(button => {
                button.addEventListener('click', handleBuyTicket);
            });
        })
        .catch(error => console.error('Error fetching search results:', error));
    } else {
        resultsTableBody.innerHTML = '<tr><td colspan="8">No search data found.</td></tr>';
    }

    const token = localStorage.getItem('token');
    const authPanel = document.querySelector('.auth-panel-small');
    if (token) {
        authPanel.innerHTML = `
            <li><a href="profile.html" class="profile-link">Profile</a></li>
            <li><a href="#" class="logout-link">Logout</a></li>
        `;

        document.querySelector('.logout-link').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = "index.html";
        });
    } else {
        authPanel.innerHTML = `
            <li><a href="login.html" class="login-link">Login</a></li>
            <li><a href="register.html" class="register-link">Register</a></li>
        `;
    }
});

function handleBuyTicket(event) {
    const button = event.target;
    const row = button.closest('tr');
    const routeId = button.getAttribute('data-route-id');
    const isLoggedIn = localStorage.getItem('token'); // Check if the user is logged in by checking for a token

    const rowData = {
        start_station_name: row.cells[0].textContent,
        time_of_start: row.cells[1].textContent,
        destination: row.cells[2].textContent,
        arrival_time: row.cells[3].textContent,
        number_of_stops: row.cells[4].textContent,
        travel_time: row.cells[5].textContent,
        route_name: row.cells[6].textContent,
        route_id: routeId
    };

    localStorage.setItem('selectedRoute', JSON.stringify(rowData));
    console.log("Selected route data saved:", rowData);

    if (isLoggedIn) {
        console.log("Redirecting to buy_ticket.html");
        window.location.href = "buy_ticket.html"; // Redirect to buy_ticket.html
    } else {
        console.log("User not logged in. Redirecting to login page.");
        window.location.href = "login.html"; // Redirect to login page if not logged in
    }
}

function updateTime() {
    const now = new Date();
    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-EN', options);

    timeElement.textContent = now.toLocaleTimeString('en-EN');
}

setInterval(updateTime, 1000);
updateTime();
