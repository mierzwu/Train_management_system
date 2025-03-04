document.addEventListener('DOMContentLoaded', () => {
    const confirmationDetails = document.getElementById('confirmationDetails');
    const purchaseResponse = JSON.parse(localStorage.getItem('purchaseResponse'));
    console.log("Purchase response data retrieved:", purchaseResponse);

    if (purchaseResponse) {
        if(purchaseResponse.color == undefined)
        {
            confirmationDetails.innerHTML = `
            <p style="color: red;"><strong>Message:</strong> ${purchaseResponse.message}</p>
        `;
            
        }
        confirmationDetails.innerHTML = `
            <p style="color: ${purchaseResponse.color};"><strong>Message:</strong> ${purchaseResponse.message}</p>
        `;
    } else {
        confirmationDetails.innerHTML = '<p>No purchase response found.</p>';
    }

    document.getElementById('backToHome').addEventListener('click', () => {
        window.location.href = "index.html";
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

setInterval(updateTime, 1000);
updateTime();
