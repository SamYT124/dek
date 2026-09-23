import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1A6K084adH7Dap5ZG5CEAXDSAoHk3owI",
  authDomain: "phumagri.firebaseapp.com",
  projectId: "phumagri",
  storageBucket: "phumagri.firebasestorage.app",
  messagingSenderId: "1049586791624",
  appId: "1:1049586791624:web:451fe2d14773093f6321fd",
  measurementId: "G-3K5MH959EQ"
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

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
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", usernameVal));
        const querySnapshot = await getDocs(q);


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

        await setDoc(doc(db, "users", generatedUid), userData);

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
