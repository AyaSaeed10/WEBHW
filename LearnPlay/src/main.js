import './style.css'
import javascriptLogo from './javascript.svg'
//import { setupCounter } from './counter.js'

function goToPage(target) 
{
  switch (target) {
    case "login":
          window.location.href = "login.html";
        break;
    case 2:
        
        break;
    case 3: 
        
        break; 
    case 4:
        
        break;
    default:
        console.log("page not found");
  }
}