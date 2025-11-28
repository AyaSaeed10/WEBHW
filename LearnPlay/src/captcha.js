document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    let isAdmin = true;

    const arithmeticChallengeSpan = document.getElementById('arithmetic-challenge');
    const arithmeticAnswerInput = document.getElementById('arithmetic-answer');
    const refreshArithmeticCaptchaButton = document.getElementById('refresh-arithmetic-captcha');
    const arithmeticError = document.getElementById('arithmetic-error');
    const captchaAttemptsError = document.getElementById('arithmetic-captcha-container');
    let arithmeticNum1, arithmeticNum2, arithmeticExpectedAnswer;
    let incorrectAttempts = 0;
    const maxIncorrectAttempts = 3;


    function generateArithmeticCaptcha() {
	//הגרלת 2 מספרים רנדומלים מ- 1 עד 10
        arithmeticNum1 = Math.floor(Math.random() * 10) + 1;
     	arithmeticNum2 = Math.floor(Math.random() * 10) + 1;
	/* אתחול אופרטור חישובי ע”י הגרלת מספר בין 1 ל- 0 ולפי בחירת חיבור 
או חיסור */
     	const operation = Math.random() < 0.5 ? '+' : '-';
	//חישוב התוצאה עבור חיבור
      if (operation === '+') {
            arithmeticExpectedAnswer = arithmeticNum1 + arithmeticNum2;
//הצגת חישוב אריתמטי עם חיבור
            arithmeticChallengeSpan.textContent = `${arithmeticNum1} + ${arithmeticNum2} = ?`;
     	} 
	//חישוב התוצאה עבור חיבור
        else {
            arithmeticExpectedAnswer = arithmeticNum1 - arithmeticNum2;
		//הצגת חישוב אריתמטי עם חיסור
            arithmeticChallengeSpan.textContent = `${arithmeticNum1} - ${arithmeticNum2} = ?`;
     }
	//ניקוי שדה התשובה והסתרת הודעת השגיאה
     arithmeticAnswerInput.value = '';
     arithmeticError.classList.add('hidden');
}
    generateArithmeticCaptcha();


    function refreshCaptcha() {
    generateArithmeticCaptcha();
}
    refreshArithmeticCaptchaButton.addEventListener('click', refreshCaptcha);

   registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (incorrectAttempts >= maxIncorrectAttempts) {
    captchaAttemptsError.classList.remove('hidden');
    return;
  }

  const username = document.getElementById('userInput').value;
  const email = document.getElementById('mailInput').value;
  const password = document.getElementById('passInput').value;
  const confirmPassword = document.getElementById('confirmInput').value;
  const pin = document.getElementById('pinInput').value;
  const confirmPinPassword = document.getElementById('confirmPinInput').value;
  const dob = document.getElementById('dateInput').value;

  registerMessage.textContent = "";
  registerMessage.classList.remove("text-green-500", "text-red-500");

  // 1. passwords match?
  if (password !== confirmPassword) {
    registerMessage.textContent = "Passwords do not match.";
    registerMessage.classList.add("text-red-500");
    return;
  }

  // 2. pins match?
  if (pin !== confirmPinPassword) {
    registerMessage.textContent = "Pins do not match.";
    registerMessage.classList.add("text-red-500");
    return;
  }

  // 3. pin is 4 digits only?
  const pinRegex = /^\d{4}$/;
  if (!pinRegex.test(pin)) {
    registerMessage.textContent = "Pin must be exactly 4 digits (numbers only).";
    registerMessage.classList.add("text-red-500");
    return;
  }

  // 4. CAPTCHA check
  const userAnswer = parseInt(arithmeticAnswerInput.value);
  if (isNaN(userAnswer) || userAnswer !== arithmeticExpectedAnswer) {
    arithmeticError.classList.remove('hidden');
    incorrectAttempts++;
    return;
  }

  // If captcha is correct:
  arithmeticError.classList.add('hidden');
  incorrectAttempts = 0;

  try {
    // 5. check if email already exists
    if (find(email)) {
      registerMessage.textContent = "Username or email already exists.";
      registerMessage.classList.add("text-red-500");
      return;
    }

    // 6. ADD USER - profiles start as empty array
    const profiles = [];
    add(username, email, password, dob, pin, profiles);

    registerMessage.textContent = "Registration successful!";
    registerMessage.classList.add("text-green-500");

    // clear form
    document.getElementById('userInput').value = "";
    document.getElementById('mailInput').value = "";
    document.getElementById('passInput').value = "";
    document.getElementById('confirmInput').value = "";
    document.getElementById('pinInput').value = "";
    document.getElementById('confirmPinInput').value = "";
    document.getElementById('dateInput').value = "";
    arithmeticAnswerInput.value = "";

    refreshCaptcha(); // new captcha

  } catch (error) {
    console.error(error);
    registerMessage.textContent = "An error occurred during registration.";
    registerMessage.classList.add("text-red-500");
  }
});
});

