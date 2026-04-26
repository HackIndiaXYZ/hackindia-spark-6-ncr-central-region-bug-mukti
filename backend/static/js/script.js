document.addEventListener('DOMContentLoaded', () => {
    
    const violationCountElement = document.getElementById('violation-count');
    const logContainerElement = document.getElementById('violation-log');

    async function fetchDashboardStats() {
        try {
            const response = await fetch('/get_stats');
            const data = await response.json();

            violationCountElement.innerText = data.violations;
            updateLog(data.recent);

        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        }
    }

    function updateLog(recentViolations) {
        if (!recentViolations || recentViolations.length === 0) {
            logContainerElement.innerHTML = `<li class="empty-log">Monitoring traffic vectors...</li>`;
            return;
        }

        logContainerElement.innerHTML = '';

        recentViolations.forEach(violation => {
            const li = document.createElement('li');
            li.className = 'log-item';
            
            li.innerHTML = `
                <div style="display: flex; flex-direction: column;">
                    <span class="log-id">🚨 Wrong Way Detected</span>
                    <span style="font-size: 0.8rem; color: #7f1d1d; margin-top: 2px;">Vehicle DeepSORT ID: ${violation.id}</span>
                </div>
                <span class="log-time">${violation.time}</span>
            `;
            
            logContainerElement.appendChild(li);
        });
    }

    setInterval(fetchDashboardStats, 1000);
    fetchDashboardStats();
});