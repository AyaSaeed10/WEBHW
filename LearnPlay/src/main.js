
function goToPage(target){
  switch (target) {
    case "login":
          window.location.href = "LearnPlay/src/login.html";
          console.log("home page");
        break;
    case "Register": 
    window.location.href = "LearnPlay/src/register.html";
          console.log("register page");
        break;
    case 3: 
        
        break; 
    case 4:
        
        break;
    default:
        console.log("page not found");
  }
}