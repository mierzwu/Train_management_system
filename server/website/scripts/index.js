document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);

    const token = localStorage.getItem('token');
    if (token) {
        const authPanel = document.querySelector('.auth-panel-small');
        authPanel.innerHTML = `
            <li><a href="profile.html" class="profile-link">Profile</a></li>
            <li><a href="#" class="logout-link">Logout</a></li>
        `;

        document.querySelector('.logout-link').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = "index.html";
        });

        // Set timeout for automatic logout after 1 hour
        setTimeout(() => {
            localStorage.removeItem('token');
            alert('You have been logged out due to inactivity.');
            window.location.href = "index.html";
        }, 3600000); // 1 hour in milliseconds
    } else {
        const authPanel = document.querySelector('.auth-panel-small');
        authPanel.innerHTML = `
            <li><a href="login.html" class="login-link">Login</a></li>
            <li><a href="register.html" class="register-link">Register</a></li>
        `;
    }
});

function updateTime() {
    const now = new Date();
    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-EN', options);

    timeElement.textContent = now.toLocaleTimeString('en-EN');
}
