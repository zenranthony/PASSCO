document.getElementById('REGISTER').onclick = function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username-input_email').value.trim();
    const passwordInput = document.getElementById('password-input').value.trim();


    let users = JSON.parse(localStorage.getItem("users")) || [];


    const newUser = {
        email: usernameInput,
        password: passwordInput
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "/LOGIN/1LOGIN.html"; 
};
