const html = document.documentElement;
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameOrEmail = document.getElementById('userInput').value;
    const password = document.getElementById('passInput').value;
    let user = find(usernameOrEmail)
    let nameOrEmail = 'test';
    let pass = 'password';
    if(user != undefined){
   nameOrEmail = user.email;
   pass = user.password;
}
if (usernameOrEmail === nameOrEmail && password === pass) {
        loginMessage.textContent = 'Login successful!';
        loginMessage.classList.remove('text-red-500');
        loginMessage.classList.add('text-green-500');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        console.log("Logged in user saved:", user);
        window.location.href = "chooseProfilePage.html";
        console.log("Choose Profiles Page");

if (user && user.isAdmin) {
  setTimeout(() => { window.location.href = 'userManagement.html'; }, 200);  
}

} else {
        loginMessage.textContent = 'Invalid username/email or password.';
        loginMessage.classList.remove('text-green-500');
        loginMessage.classList.add('text-red-500');
}



})
