import { db, doc, setDoc } from "./modules/firebase.js";

const startTime = Date.now();

const loadingScreen = document.getElementById('loading-screen');

if (loadingScreen) {
  const timeElapsed = Date.now() - startTime;
  const minimumDisplayTime = 3000; 
  const remainingTime = Math.max(0, minimumDisplayTime - timeElapsed);
  
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
      console.log("Loading screen cleared successfully!");
    }, 500); 
  }, remainingTime);
}

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
        if (surveyAnswers['lang'] === "khm") {
            quest3Sur.textContent = 'ចុះឈ្មោះចូលDEK';
            fullnametxt.textContent = "ឈ្មោះពេញ";
            usernametxt.textContent = "ឈ្មោះគណនី";
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

// Error Element Selectors
const fullError = document.getElementById('error0');
const userError = document.getElementById('error');
const ageError = document.getElementById('error2');
const passError = document.getElementById('error3');
const retError = document.getElementById('error4');
const phoneError = document.getElementById('error5');

// Text Input Label Selectors
const usernametxt = document.getElementById('username');
const agetxt = document.getElementById('agetxt');
const passwordtxt = document.getElementById('password');
const retpasstxt = document.getElementById('retpassword');
const phonenumtxt = document.getElementById('regPNum');
const fullnametxt = document.getElementById('fullname');

// Unified form field validation function
function logIn(fullName, user, age, pass, retpass) {
    let hasError = false;

    // Reset error display texts
    fullError.textContent = '';
    userError.textContent = '';
    ageError.textContent = '';
    passError.textContent = '';
    retError.textContent = '';
    phoneError.textContent = '';

    // 1. Full Name Unicode Validation (Letters and spaces only)
    const fullNameRegex = /^[\p{L}\s]+$/u;
    if (fullName.length === 0) {
        if (surveyAnswers['lang'] === "khm") {
            fullError.textContent = 'សូមបញ្ចូលឈ្មោះពេញ!';
        } else {
            fullError.textContent = 'Please enter your full name!';
        }
        hasError = true;
    } else if (!fullNameRegex.test(fullName)) {
        if (surveyAnswers['lang'] === "khm") {
            fullError.textContent = 'ឈ្មោះពេញមិនអាចមានលេខ ឬនិមិត្តសញ្ញាឡើយ!';
        } else {
            fullError.textContent = 'Full name cannot contain numbers or symbols!';
        }
        hasError = true;
    }
    
    // 2. Username Length Check
    if (user.length <= 3) {
        if (surveyAnswers['lang'] === "khm") {
            userError.textContent = 'ឈ្មោះត្រូវតែមានលេីស៣អក្សរ!';
        } else {
            userError.textContent = 'Username must be over 3 characters!';
        }
        hasError = true;
    }
    
    // 3. Username Spaces Check
    if (user.includes(" ")) {
        if (surveyAnswers['lang'] === "khm") {
            userError.textContent = 'ឈ្មោះត្រូវតែមានអក្សរ លេខ នីងគូសបញ្ជាក់!';
        } else {
            userError.textContent = 'Username only have characters, numbers, and underscores!';
        }
        hasError = true;
    }
    
    // 4. Age Boundary Check
    if (isNaN(age) || age < 18) {
        if (surveyAnswers['lang'] === "khm") {
            ageError.textContent = 'អាយុត្រូវលេីស១៨ឆ្នាំ!';
        } else {
            ageError.textContent = 'Age must be over 18!';
        }
        hasError = true;
    }
    
    // 5. Password Matching Check
    if (pass !== retpass) {
        if (surveyAnswers['lang'] === "khm") {
            retError.textContent = 'ពាក្យសម្ងាត់ត្រូវតែដូចគ្នា!';
        } else {
            retError.textContent = 'Passwords must be the same!';
        }
        hasError = true;
    } 
    
    // 6. Password Length Check
    if (pass.length < 8) {
        if (surveyAnswers['lang'] === "khm") {
            passError.textContent = 'ពាក្យសម្ងាត់ត្រូវតែលេីស៨អក្សរ!';
        } else {
            passError.textContent = 'Password must be over 8 characters!';
        }
        hasError = true;
    }

    return hasError;
}

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    console.log("Form submit triggered!");
    // FIXED: Changed regFullName to regFullname to match your HTML exactly
    const fullNameVal = document.getElementById('regFullname').value.trim(); 
    const usernameVal = document.getElementById('regUsername').value.trim();
    const ageVal = parseInt(document.getElementById('regAge').value, 10);
    const passVal = document.getElementById('regPassword').value;
    const retpassVal = document.getElementById('retPassword').value;
    const phoneVal = document.getElementById('regPNum').value.trim();

    // Run combined validation rules
    const validationFailed = logIn(fullNameVal, usernameVal, ageVal, passVal, retpassVal);

    if (validationFailed) {
        return; 
    }

    const userUid = "biDCO5C5zZZWfuD6omZVcAK0Zzt2"; // Mock UID

    const userData = {
        age: ageVal,
        displayName: usernameVal,      
        fullName: fullNameVal, 
        phoneNumber: phoneVal,         
        uid: userUid, 
        userType: surveyAnswers['user'] === 'farmer' ? "Farmer" : "Customer" 
    };

    try {
        console.log("Attempting to write to Firebase Firestore...");
        await window.setDoc(window.doc(window.db, "users", userUid), userData);
        console.log("Firebase write success!");

        surveyAnswers['registeredUser'] = usernameVal;
        
        document.querySelector('.survey-wrap').style.display = 'none';
        if (mainweb) mainweb.style.display = 'block';

        // Use standard href mapping instead of replace for simpler file routing
        window.location.href = "./dashboard.html"; 

    } catch (error) {
        console.error("Firebase Firestore operation failed critically:", error);
        alert("Registration failed database sync: " + error.message);
    }

});
