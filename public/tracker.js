// Function to generate a random unique user ID (e.g., UUID format)
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9); // Generates a random string like user_abc123xyz
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Cookie expiration in days
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Setting the cookie
}

// Function to get the user ID from the cookie
function getUserIdFromCookie() {
    const name = "user_id=";
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookies = decodedCookies.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length); // Return user ID value
        }
    }
    return null; // If not found
}

// Check if the user ID exists in cookies, if not, generate one and store it
function checkAndSetUserId() {
    let userId = getUserIdFromCookie(); // Try to get the user ID from cookies
    if (!userId) {
        userId = generateUserId(); // Generate a new user ID if it doesn't exist
        setCookie('user_id', userId, 365); // Set the cookie for 1 year
        console.log('New user ID generated and stored in cookie:', userId);
    } else {
        console.log('Existing user ID from cookie:', userId);
    }
    return userId; // Return the user ID
}

// When the page loads, check for the user ID and log the page load
window.addEventListener('load', () => {
    const userId = checkAndSetUserId(); // Get or set the user ID
    const timestamp = new Date().toISOString(); // Get the current timestamp

    // Send the user ID and timestamp to the server to log the page load
    fetch('/log-page-load', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId, // Pass the user ID
            timestamp: timestamp // Pass the page load timestamp
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Page load logged successfully!');
        } else {
            console.error('Failed to log page load');
        }
    })
    .catch(error => {
        console.error('Error logging page load:', error);
    });
});
