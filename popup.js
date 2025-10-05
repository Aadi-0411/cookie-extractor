document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copyCookies');
    const statusDiv = document.getElementById('status');

    copyButton.addEventListener('click', () => {
        statusDiv.textContent = 'Fetching...';

        // 1. Fetch all cookies for YouTube
        chrome.cookies.getAll({ domain: "youtube.com" }, (cookies) => {
            if (!cookies || cookies.length === 0) {
                statusDiv.textContent = 'Error: No cookies found. Are you logged into YouTube?';
                return;
            }

            try {
                // 2. Stringify the cookies into the JSON format expected by your server
                const jsonCookies = JSON.stringify(cookies, null, 2);

                // 3. Write the JSON string to the user's clipboard
                navigator.clipboard.writeText(jsonCookies).then(() => {
                    statusDiv.textContent = '✅ Cookies copied to clipboard!';
                    statusDiv.style.color = '#00ff00';
                    setTimeout(() => { window.close(); }, 1500); // Close the popup after success
                }).catch(err => {
                    statusDiv.textContent = `Error copying: ${err.message}`;
                    statusDiv.style.color = '#ff0000';
                });

            } catch (e) {
                statusDiv.textContent = `Processing error: ${e.message}`;
            }
        });
    });
});