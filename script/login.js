let loginBtn = document.getElementById("login-btn");
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    let password = passwordInput.value;

    if(username === "admin" && password === "admin123"){
        window.location.href = "dashboard.html";
    }else{
        alert("Invalid username or password");
    }
});