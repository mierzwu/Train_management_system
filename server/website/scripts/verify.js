document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const verifyMessage = document.getElementById('verifyMessage');

    if (token) {
        fetch(`/verify_email?token=${token}`)
            .then(response => response.json())
            .then(data => {
                verifyMessage.textContent = data.message;
                verifyMessage.style.color = data.color;
            })
            .catch(error => {
                console.error('Error verifying email:', error);
                verifyMessage.textContent = 'Error verifying email. Please try again later.';
                verifyMessage.style.color = 'red';
            });
    } else {
        verifyMessage.textContent = 'Invalid verification link.';
        verifyMessage.style.color = 'red';
    }
});
