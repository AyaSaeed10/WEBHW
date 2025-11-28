const file="db.json"
let users =[]
function initUsers() {
    let rawFile = new XMLHttpRequest(); //יצירת אובייקט בקשה חדש
    rawFile.open("GET", file , false); //פתיחת בקשה לפתיחת הקובץ
    rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4)  {
		// (בדיקה אם הסטטוס תקין (200 - הצלחה, 0 - לעיתים בקובץ מקומי
        if(rawFile.status === 200 || rawFile.status == 0) {
            let allText = rawFile.responseText; // קריאת הטקסט מהתגובה
            let data = JSON.parse(allText) // המרת הטקסט לאובייקט
            users = data.users // שמירת מערך המשתמשים במשתנה גלובלי
       }
    }
  }
  rawFile.send(null); // שליחת הבקשה
}
function find(email) {
    return users.some(u => u.email === email);
}



function updateData(){
    //המרת מערך המשתמשים למחרוזת עם מבנה הרצוי שהוגדר בשלב 1
    let data ='{ "users": '+JSON.stringify(users) + '}'
    //יצירת אובייקט בינארי של הנתונים
    const blob = new Blob([data], { type: 'application/json' });
    //יצירת כתובת רשת זמנית לאובייקט
    const url = URL.createObjectURL(blob);
    //יצירת אלמנט קישור להורדת הקובץ
    const a = document.createElement('a');
    a.download = file; //הגדרת שם הקובץ שיישמר
    a.href = url; //הצמדת כתובת הרשת של האובייקט לאלמנט
    a.click(); // סימולציה של לחיצה כדי להתחיל בהורדה
    URL.revokeObjectURL(url); // ניקוי המשאב מהזיכרון
}


function add(username, email, password, dob, pin, profiles = []) {
    // load users from file
    initUsers();

    // create new user and add to array
    const user = {
        username: username,
        email: email,
        password: password,
        dob: dob,
        pin: pin,        
        profiles: profiles 
    };

    users.push(user);

    // update json file (download new version)
    updateData();
}

