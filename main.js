const startTime = Date.now();

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const timeElapsed = Date.now() - startTime;
  const minimumDisplayTime = 3000; 
  const remainingTime = Math.max(0, minimumDisplayTime - timeElapsed);
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500); 
    
  }, remainingTime);
});

const surveyAnswers = {};
const quest2Sur = document.getElementById('q2');
const quest3Sur = document.getElementById('q3');
const farmopt = document.getElementById('farOpt');
const custopt = document.getElementById('cusOpt');
const mainweb = document.getElementById('main');
const survey = document.getElementById('survey');

const signUpBtn = document.getElementById('signUpBtn');

function saveAnswer(questionKey, answerValue, currentStep) {
    surveyAnswers[questionKey] = answerValue;
    console.log("Current Answers:", surveyAnswers);
    const currentEl = document.querySelector(`.question-step[data-step="${currentStep}"]`);
    const nextEl = document.querySelector(`.question-step[data-step="${currentStep + 1}"]`);
      
    if (nextEl) {
        currentEl.classList.remove('active');
        nextEl.classList.add('active');
    }

    if (currentStep === 1) {
        if (surveyAnswers['lang'] === "khm") {
            quest2Sur.textContent = 'តើមួយណាដែលពណ៌នាអំពីអ្នកបានល្អបំផុត?';
            farmopt.textContent = 'កសិករ';
            custopt.textContent = 'អតិថិជន';
        } else if (surveyAnswers['lang'] === "chi") {
            quest2Sur.textContent = '以下哪项最能描述你?';
            farmopt.textContent = '农民';
            custopt.textContent = '买主';
        } 
    }

    if (currentStep === 2) {
        if (surveyAnswers['lang']==="khm") {
            quest3Sur.textContent = 'ចុះឈ្មោះចូលDEK';
            usernametxt.textContent = "ឈ្មោះ";
            agetxt.textContent = "អាយុ";
            passwordtxt.textContent = "ពាក្យសម្ងាត់";
            retpasstxt.textContent = "វាយបញ្ចូលពាក្យសម្ងាត់ម្តងទៀត";
            signUpBtn.textContent = "ចុះឈ្មោះ";
        }
    }

    if (currentStep === 3) {
        document.querySelector('.survey-wrap').style.display = 'none'; 
        mainweb.style.display = 'block'; 
    }
}

const userError = document.getElementById('error');
const ageError = document.getElementById('error2');
const passError = document.getElementById('error3');
const retError = document.getElementById('error4');

const usernametxt = document.getElementById('username');
const agetxt = document.getElementById('agetxt');
const passwordtxt = document.getElementById('password');
const retpasstxt = document.getElementById('retpassword');

function logIn(user, age, pass, retpass) {
    let hasError = false;

    userError.textContent = '';
    ageError.textContent = '';
    passError.textContent = '';
    retError.textContent = '';

    if (user.length <= 3) {
        if (surveyAnswers['lang']==="khm") {
            userError.style.display = "block";
            userError.textContent = 'ឈ្មោះត្រូវតែមានលេីស៣អក្សរ!';
        }
        hasError = true;
    }
    if (user.includes(" ")) {
        userError.style.display = "block";
        userError.textContent = 'Username must only contain characters, numbers, and underscores!';
        hasError = true;
    }
    if (age < 18) {
        ageError.style.display = "block";
        ageError.textContent = 'Age must be 18 and above!';
        hasError = true;
    }
    if (pass !== retpass) {
        retError.style.display = "block";
        retError.textContent = 'Passwords must match!';
        hasError = true;
    }
    if (pass.length < 8) {
        passError.style.display = "block";
        passError.textContent = 'Passwords must be at least 8 characters!';
        hasError = true;
    }

    return hasError;
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const usernameVal = document.getElementById('regUsername').value.trim();
    const ageVal = parseInt(document.getElementById('regAge').value, 10);
    const passVal = document.getElementById('regPassword').value;
    const retpassVal = document.getElementById('retPassword').value; 
    const validationFailed = logIn(usernameVal, ageVal, passVal, retpassVal);

    if (validationFailed) {
        return;
    }

    const userData = {
        username: usernameVal,
        age: ageVal,
        password: passVal,                  
        language: surveyAnswers['lang'] || 'eng',
        profileType: surveyAnswers['user'] || ''  
    };
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.username.toLowerCase() === usernameVal.toLowerCase());
    
    if (userExists) {
        userError.textContent = 'This username is already taken!';
        return;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    surveyAnswers['registeredUser'] = usernameVal;
    surveyAnswers['registeredAge'] = ageVal;
    surveyAnswers['password'] = passVal;

    console.log("Structured User Object (Ready for Database):", userData);
    console.log("Final Registration Data Complete:", surveyAnswers);
    
    alert('Sign Up Complete! Redirecting to dashboard...');

    document.querySelector('.survey-wrap').style.display = 'none'; 
    if (mainweb) {
        mainweb.style.display = 'block'; 
    }
});
