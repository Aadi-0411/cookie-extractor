// popup.js

/**
 * @fileoverview This script is for the Chrome Extension popup.
 * @suppress {uselessCode}
 */
// @ts-check
// @ts-ignore
/// <reference types="chrome" />

// Utility function to fetch cookies for a given domain
function fetchCookies(domain) {
    return new Promise(resolve => {
        chrome.cookies.getAll({ domain: domain }, resolve);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copyCookies');
    const statusDiv = document.getElementById('status');

    copyButton.addEventListener('click', async () => { // Changed to async function
        statusDiv.textContent = 'Fetching cookies from YouTube and Google...';

        try {
            // 1. Fetch cookies for BOTH domains
            const youtubeCookies = await fetchCookies("youtube.com");
            const googleCookies = await fetchCookies("google.com");

            const allCookies = [...youtubeCookies, ...googleCookies];

            if (allCookies.length === 0) {
                statusDiv.textContent = 'Error: No cookies found. Are you logged into YouTube/Google?';
                return;
            }

            // 2. Stringify the combined array
            const jsonCookies = JSON.stringify(allCookies, null, 2);

            // 3. Write to the user's clipboard
            navigator.clipboard.writeText(jsonCookies).then(() => {
                statusDiv.textContent = `✅ ${allCookies.length} cookies copied to clipboard! Paste into Detoxify.`;
                statusDiv.style.color = '#00ff00';
                setTimeout(() => { window.close(); }, 2500);
            }).catch(err => {
                statusDiv.textContent = `Error copying to clipboard: ${err.message}`;
                statusDiv.style.color = '#ff0000';
            });

        } catch (e) {
            statusDiv.textContent = `Processing error: ${e.message}`;
            statusDiv.style.color = '#ff0000';
        }
    });
});