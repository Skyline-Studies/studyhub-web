import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        showLogin.style.display = 'none';
        showSignup.style.display = 'block';
    });
}

if (showSignup) {
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        showLogin.style.display = 'block';
        showSignup.style.display = 'none';
    });
}


window.signUpWithEmail = function() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            console.error("Sign up failed:", error);
            alert("Error signing up: " + error.message);
        });
}

window.loginWithEmail = function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            console.error("Login failed:", error);
            alert("Error logging in: " + error.message);
        });
}

window.signInWithGoogle = function() {
    signInWithPopup(auth, provider)
        .catch((error) => {
            console.error("Google sign-in failed:", error);
            alert("Error with Google sign-in: " + error.message);
        });
}

onAuthStateChanged(auth, (user) => {
    if (user && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        window.location.href = 'home.html';
    }
});