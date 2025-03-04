document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const login = document.getElementById('login').value;
    const password_login = document.getElementById('password').value;

    console.log("Sending login request with data:", { login, password_login });

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password_login })
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        if (data.token) {
            console.log("Token received:", data.token); 
            localStorage.setItem('token', data.token); 
            localStorage.setItem('document', data.document);
            displayResponseMessage("Login successful! Redirecting...", "green");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect to the index page after 2 seconds
            }, 2000);
        } else {
            console.error("Login failed:", data.message);
            displayResponseMessage(data.message, "red");
        }
    })
    .catch(error => console.error('Error during login:', error));
});

function displayResponseMessage(message, color) {
    const responseElement = document.getElementById('responseMessage');  // Get the div
    if (responseElement) {
        responseElement.textContent = message;  // Set the message text
        responseElement.style.color = color;    // Set the text color (green for success, red for error)
    } else {
        console.error("Response element not found!");
    }
}