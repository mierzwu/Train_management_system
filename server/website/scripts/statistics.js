document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch('/get_statistics', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const routeData = data.mostUsedRoutes;
        const documentData = data.mostUsedDocuments;

        // Chart for most used routes
        const routeCtx = document.getElementById('routeChart').getContext('2d');
        new Chart(routeCtx, {
            type: 'bar',
            data: {
                labels: routeData.map(item => item.route_name),
                datasets: [{
                    label: 'Most Used Routes',
                    data: routeData.map(item => item.count),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Chart for most used documents
        const documentCtx = document.getElementById('documentChart').getContext('2d');
        new Chart(documentCtx, {
            type: 'bar',
            data: {
                labels: documentData.map(item => item.document_name),
                datasets: [{
                    label: 'Most Used Documents',
                    data: documentData.map(item => item.count),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching statistics:', error));
});
