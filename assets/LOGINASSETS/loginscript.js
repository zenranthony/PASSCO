// --- Configuration ---
/*const VALID_USERNAME = "ejay";
const VALID_PASSWORD = "123"; */
const DASHBOARD_URL = "/ANNOUNCEMENT/2ANNOUNCEMENT_PAGE.html"; 

function loginUser() {
    const usernameInput = document.getElementById('username-input').value.trim();
    const passwordInput = document.getElementById('password-input').value.trim();
    const messageElement = document.getElementById('login-message');

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(user => 
        user.email === usernameInput && user.password === passwordInput
    );

    if (foundUser) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("loggedInUser", foundUser.email);

        messageElement.textContent = "Login successful! Redirecting...";
        messageElement.style.color = "#4CAF50";

        setTimeout(() => {
            window.location.href = "/ANNOUNCEMENT/2ANNOUNCEMENT_PAGE.html";
        }, 500);

    } else {
        messageElement.textContent = "Invalid username or password.";
        messageElement.style.color = "red";
    }
// paki delete salamat
    if (usernameInput === "renzbisaya") {
        alert("BISAYA KA RENZ");
    } else if (usernameInput === "francisbisaya") {
        alert("BISAYA KA FRANCIS"); }
}


function logoutUser() {
    // 1. Clear the storage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('loggedInUser');

    // 2. Redirect back to the login page (index.html)
    window.location.href = 'index.html'; 
}
