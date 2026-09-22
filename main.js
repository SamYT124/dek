const firebaseConfig = {
  apiKey: "AIzaSyB1A6K084adH7Dap5ZG5CEAXDSAoHk3owI",
  authDomain: "phumagri.firebaseapp.com",
  projectId: "phumagri",
  storageBucket: "phumagri.firebasestorage.app",
  messagingSenderId: "1049586791624",
  appId: "1:1049586791624:web:451fe2d14773093f6321fd",
  measurementId: "G-3K5MH959EQ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
    
    // FIXED: Added missing backticks for template literals
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
const phoneError = document.getElementById('error5');

const usernametxt = document.getElementById('username');
const agetxt = document.getElementById('agetxt');
const passwordtxt = document.getElementById('password');
const retpasstxt = document.getElementById('retpassword');
const phonenumtxt = document.getElementById('regPNum');

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
        } else {
            userError.style.display = "block";
            userError.textContent = 'Username must be over 3 characters!';
        }
        hasError = true;
    }
    if (user.includes(" ")) {
        if (surveyAnswers['lang']==="khm") {
            userError.style.display = "block";
            userError.textContent = 'ឈ្មោះត្រូវតែមានអក្សរ​ លេខ នីងគូសបញ្ជាក់!';
        } else {
            userError.style.display = "block";
            userError.textContent = 'Username only have characters, numbers, and underscores!';
        }
        hasError = true;
    }
    if (age < 18) {
        if (surveyAnswers['lang']==="khm") {
            ageError.style.display = "block";
            ageError.textContent = 'អាយុត្រូវលេីស១៨ឆ្នាំ!';
        } else {
            ageError.style.display = "block";
            ageError.textContent = 'Age must be over 18!';
        }
        hasError = true;
    }
    if (pass !== retpass) {
        if (surveyAnswers['lang']==="khm") {
            retError.style.display = "block";
            retError.textContent = 'ពាក្យសម្ងាត់ត្រូវតែដូចគ្នា!';
        } else {
            retError.style.display = "block";
            retError.textContent = 'Passwords must be the same!';
        }
        hasError = true;
    } 
    if (pass.length < 8) {
        if (surveyAnswers['lang']==="khm") {
            passError.style.display = "block";
            passError.textContent = 'ពាក្យសម្ងាត់ត្រូវតែលេីស៨អក្សរ!';
        } else {
            passError.style.display = "block";
            passError.textContent = 'Password must be over 8 characters!';
        }
        hasError = true;
    }

    return hasError;
}

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usernameVal = document.getElementById('regUsername').value.trim();
    const ageVal = parseInt(document.getElementById('regAge').value, 10);
    const passVal = document.getElementById('regPassword').value;
    const retpassVal = document.getElementById('retPassword').value;
    
    // FIXED: Added missing || operators
    const fullNameVal = surveyAnswers['fullName'] || 'Char Nang'; 
    const phoneVal = surveyAnswers['phoneNumber'] || '+855077555123';
    const userTypeVal = surveyAnswers['user'] || 'Farmer';

    const validationFailed = logIn(usernameVal, ageVal, passVal, retpassVal); 
    if (validationFailed) {
        return; 
    }

    try {
        const querySnapshot = await db.collection("users").where("displayName", "==", usernameVal).get();

        if (!querySnapshot.empty) {
            userError.style.display = "block";
            userError.textContent = 'This username is already taken!';
            return;
        } else {
            userError.textContent = '';
        }

        const generatedUid = "user_" + Math.random().toString(36).substring(2, 15);

        const userData = {
            age: ageVal,
            displayName: usernameVal,
            fullName: fullNameVal,
            password: passVal,
            phoneNumber: phoneVal,
            uid: generatedUid,
            userType: userTypeVal
        };

        await db.collection("users").doc(generatedUid).set(userData);

        surveyAnswers['registeredUser'] = usernameVal;
        surveyAnswers['registeredAge'] = ageVal;
        surveyAnswers['password'] = passVal;

        console.log("User successfully saved to Firestore:", userData);

        document.querySelector('.survey-wrap').style.display = 'none';
        if (typeof mainweb !== 'undefined' && mainweb) {
            mainweb.style.display = 'block';
        }
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Firestore database error:", error);
        userError.style.display = "block";
        userError.textContent = 'Failed to register. Please check your database rules.';
    }
});
