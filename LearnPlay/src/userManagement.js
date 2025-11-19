const html = document.documentElement;
const userName = document.getElementById('userName');
let users = []; // נשמור כאן את תוכן db.json.users

window.onload = function() {
	//משתנה לטעינת פרטי המשתמש שהתחבר
  let user = JSON.parse(localStorage.getItem('loggedInUser'))
//עדכון כותרת להצגת שם המשתמש שהתחבר
  userName.innerHTML = "Welcome " + user.username


//שליחת בקשה לשליפת נתונים מהקובץ
  fetch('db.json')
     .then(response =>  response.json()) //שמירת אובייקט התשובה
     .then(jsonData => { //שמירת נתוני הקובץ
//שליחה לפונקציה לטעינה לטבלה
            users = Array.isArray(jsonData.users) ? jsonData.users : []; // ← חשוב
        	populateTable('usersData', jsonData);   
}); 
};
function populateTable(tableId, jsonData) {
    //משתנה לקישור לתגיות הטבלה
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    //אתחול של תוכן רכיבי הטבלה
    thead.innerHTML = '';
    tbody.innerHTML = '';
    //אם קיימים נתוני משתמשים בקובץ
    if (jsonData.users.length > 0) {
	  //ניקח את כל המפתחות מקובץ לתוך משתנה
        const headers = Object.keys(jsonData.users[0]);
	  //עבור כל מפתח
        headers.forEach(header => {
            if(header != "password"){ //אם הוא לא סיסמא
		    //ניצור למפתח תא כותרת
                const th = document.createElement('th'); 
                th.textContent = header;
                th.classList.add('px-4', 'py-2', 'text-left');
		     //נוסיף לשורת הכותרת של הטבלה
                thead.appendChild(th);
            }
        });
        //עבור כל אובייקט בתוך המערך
        jsonData.users.forEach(item => {
		//ניצור רשומה בטבלה
            const tr = document.createElement('tr');
		//לכל מפתח שאינו סיסמא
            headers.forEach(header => {
                if(header != "password"){
				
			   //ניצור תא עם תוכן 
                    const td = document.createElement('td');
                    td.textContent = item[header];
                    td.classList.add('border', 'px-4', 'py-2');
                    //נוסיף מאזין לתא כדי שנוכל לבצע עריכה
                    td.addEventListener("dblclick", ()=>editable.edit(td))
			   //נוסיף את התא לרשומה
                    tr.appendChild(td);
                }
            });
		//נוסיף לגוף הטבלה את הרשומה
            tbody.appendChild(tr);
        });
    } 
    //אם לא קיימים נתוני משתמשים בקובץ
    else {
        //יצירת שורה בטבלה
        const tr = document.createElement('tr');
        //יצירת עמודה בטבלה
        const td = document.createElement('td');
	  //הוספת תוכן לעמודה שאין מידע
        td.textContent = "No data found in JSON.";
	  //הוספת השורה עם התוכן לגוף הטבלה
        tbody.appendChild(tr);
    }
}

let editable = {
    ccell : null, //הפנייה לתא
    cval : null, //תוכן התא
    edit: cell=>{ //אם בוצעה לחיצה כפולה
        editable.ccell = cell; //שמירת התא שעליו נלחץ
        editable.cval = cell.innerHTML; //שמירת תוכן התא שעליו נלחץ
        cell.classList.add("edit"); //הוספת ויזואליזציה של עריכה
        cell.contentEditable = true; //שינוי מצב שהתא בעריכה
        cell.focus();
        cell.onblur = editable.done; //ברגע שנלחץ מחוץ לתא הגדרת סיום
        cell.onkeydown = e =>{ //במידה ונלחץ אנטר או אסקייפ הגדרת סיום
            if(e.key == "Enter"){ editable.done(); }
            if(e.key == "Escape"){ editable.done(1); }
        }
    },
    done: discard =>{ //אם בוצע סיום
	  //שחרור מאזינים
        editable.ccell.onblur = ""; 
        editable.ccell.onkeydown = "";
	  //הורדת ויזואליזציה של עריכה
        editable.ccell.classList.remove("edit");
  //שינוי מצב שהתא לא בעריכה
        editable.ccell.contentEditable = false;
        if(discard===1){ //if escape
            editable.ccell.innerHTML = editable.cval; //החזרת ערך קודם
        }
	  //אם הערך שונה יש לבצע עדכון קובץ
        //אם הערך שונה יש לבצע עדכון קובץ
if (editable.ccell.innerHTML != editable.cval) {
  console.log("change");

  // --- מציאת השדה והשורה ששונו ---
  const cell   = editable.ccell;
  const rowEl  = cell.parentElement;
  const colIdx = Array.from(rowEl.children).indexOf(cell);

  // כותרות העמודות לפי ה-<th> בטבלה
  const headers = Array.from(document.querySelector('#usersData thead tr').children)
    .map(th => th.textContent.trim());
  const key = headers[colIdx]; // השדה ששונה (username/email/dob/isAdmin/...)

  // זיהוי המשתמש לפי username שבעמודה הראשונה
  const username = rowEl.children[0].textContent.trim();

  // --- עדכון מערך users ---
  const i = users.findIndex(u => String(u.username).trim() === username);
  if (i !== -1) {
    let newVal = cell.textContent.trim();
    if (key === 'isAdmin') newVal = (newVal.toLowerCase() === 'true'); // המרה לבוליאני
    users[i][key] = newVal;
    console.log('Updated row:', users[i]);
  } else {
    console.warn('User not found for username:', username);
  }

  // --- יצירת ושמירת הקובץ המעודכן ---
  const data = '{ "users": ' + JSON.stringify(users, null, 2) + ' }';
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.download = 'db.updated.json';
  a.href     = url;
  a.click();
  URL.revokeObjectURL(url);
}


    }
}


