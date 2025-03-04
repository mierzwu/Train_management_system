document.addEventListener('DOMContentLoaded', () => {
    const ticketDetails = document.getElementById('ticketDetails');
    const selectedRoute = JSON.parse(localStorage.getItem('selectedRoute'));
    console.log("Selected route data retrieved:", selectedRoute);

    if (selectedRoute) {
        const travel_time = selectedRoute.travel_time;
        const document = localStorage.getItem('document');
        let price;

        switch(document) {
            case "DOSO":
                if(travel_time <= 20)  price = 4.40;
                else if(travel_time > 20 && travel_time <= 40) price = 5.60;
                else price = 13.10;
                break;
            case "KDRO":
                if(travel_time <= 20) price = 2.77;
                else if(travel_time > 20 && travel_time <= 40) price = 3.53;
                else price = 8.25;
                break;
            case "KKOM":
                if(travel_time <= 20) price = 2.16;
                else if(travel_time > 20 && travel_time <= 40) price = 2.74;
                else price = 6.42;
                break;
            case "KLOD": 
                if(travel_time <= 20) price = 3.65;
                else if(travel_time > 20 && travel_time <= 40) price = 4.65;
                else price = 10.87;
                break;
            case "KSEN":
                if(travel_time <= 20) price = 3.08;
                else if(travel_time > 20 && travel_time <= 40) price = 3.92;
                else price = 9.17;
                break;
            case "KZOL":
                if(travel_time <= 20) price = 0.97;
                else if(travel_time > 20 && travel_time <= 40) price = 1.23;
                else price = 2.88;
                break;
            case "LSTU":
                if(travel_time <= 20) price = 2.16;
                else if(travel_time > 20 && travel_time <= 40) price = 2.74;
                else price = 6.24;
                break;
            case "LSZK":
                if(travel_time <= 20) price = 2.77;
                else if(travel_time > 20 && travel_time <= 40) price = 3.53;
                else price = 8.25;
                break;
            default:
                price = 0;
        }

        ticketDetails.innerHTML = `
            <p><strong>Start Station:</strong> ${selectedRoute.start_station_name}</p>
            <p><strong>Departure Time:</strong> ${selectedRoute.time_of_start}</p>
            <p><strong>Destination:</strong> ${selectedRoute.destination}</p>
            <p><strong>Arrival Time:</strong> ${selectedRoute.arrival_time}</p>
            <p><strong>Number of Stops:</strong> ${selectedRoute.number_of_stops}</p>
            <p><strong>Travel Time:</strong> ${selectedRoute.travel_time}</p>
            <p><strong>Route Name:</strong> ${selectedRoute.route_name}</p>
            <p><strong>Price:</strong> ${price.toFixed(2)} PLN</p>
        `;
    } else {
        ticketDetails.innerHTML = '<p>No route selected.</p>';
    }

    document.getElementById('confirmPurchase').addEventListener('click', handleConfirmPurchase);
});

function handleConfirmPurchase() {
    const selectedRoute = JSON.parse(localStorage.getItem('selectedRoute'));
    const token = localStorage.getItem('token');

    if (selectedRoute && token) {
        const start_station_name = selectedRoute.start_station_name;
        const destination = selectedRoute.destination;
        const travel_time = selectedRoute.travel_time;
        const route_id = selectedRoute.route_id;
        const date = new Date();
        const date_of_purchase = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const document = localStorage.getItem('document');
        let price;

        switch(document) {
            case "DOSO":
                if(travel_time <= 20)  price = 4.40;
                else if(travel_time > 20 && travel_time <= 40) price = 5.60;
                else price = 13.10;
                break;
            case "KDRO":
                if(travel_time <= 20) price = 2.77;
                else if(travel_time > 20 && travel_time <= 40) price = 3.53;
                else price = 8.25;
                break;
            case "KKOM":
                if(travel_time <= 20) price = 2.16;
                else if(travel_time > 20 && travel_time <= 40) price = 2.74;
                else price = 6.42;
                break;
            case "KLOD": 
                if(travel_time <= 20) price = 3.65;
                else if(travel_time > 20 && travel_time <= 40) price = 4.65;
                else price = 10.87;
                break;
            case "KSEN":
                if(travel_time <= 20) price = 3.08;
                else if(travel_time > 20 && travel_time <= 40) price = 3.92;
                else price = 9.17;
                break;
            case "KZOL":
                if(travel_time <= 20) price = 0.97;
                else if(travel_time > 20 && travel_time <= 40) price = 1.23;
                else price = 2.88;
                break;
            case "LSTU":
                if(travel_time <= 20) price = 2.16;
                else if(travel_time > 20 && travel_time <= 40) price = 2.74;
                else price = 6.24;
                break;
            case "LSZK":
                if(travel_time <= 20) price = 2.77;
                else if(travel_time > 20 && travel_time <= 40) price = 3.53;
                else price = 8.25;
                break;
            default:
                price = 0;
        }

        const ticket_data = { start_station_name, destination, travel_time, route_id, token, price, date_of_purchase };
        console.log("Confirming purchase for route:", selectedRoute);
        fetch('/buy_ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket_data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Purchase response:", data);
            localStorage.setItem('purchaseResponse', JSON.stringify(data));
            window.location.href = "buy_confirmation.html"; // Redirect to buy_confirmation.html
        })
        .catch(error => {
            console.error('Error during purchase:', error);
            alert('There was an error processing your purchase. Please try again later.');
        });
    } else {
        console.error("No route selected or user not logged in.");
        alert('No route selected or user not logged in.');
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
