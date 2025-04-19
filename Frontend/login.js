// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB04ab3r-h3sX6qtyeTbm0yI_X1s6yERiw",
  authDomain: "hackathon2-9af58.firebaseapp.com",
  projectId: "hackathon2-9af58",
  storageBucket: "hackathon2-9af58.appspot.com",
  messagingSenderId: "526690056650",
  appId: "1:526690056650:web:6bead5068ea6b46e5ef733",
  measurementId: "G-L0VKKNMWLL"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Toggle Login/Register
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

showLogin.onclick = () => {
  showLogin.classList.add('active');
  showRegister.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
};

showRegister.onclick = () => {
  showRegister.classList.add('active');
  showLogin.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
};

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "main.html"; // 🔁 Redirect after login
    })
    .catch((error) => alert(error.message));
});

// Register
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) return alert("Passwords do not match.");

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({ displayName: name }).then(() => {
        return db.collection("users").doc(user.uid).set({
          uid: user.uid,
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    })
    .then(() => {
      alert("Registration successful and user data saved!");
      window.location.href = "main.html"; // 🔁 Redirect after registration
    })
    .catch((error) => alert(error.message));
});

// Google Login
document.getElementById('googleLogin').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      const userRef = db.collection("users").doc(user.uid);
      return userRef.get().then(doc => {
        if (!doc.exists) {
          return userRef.set({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      });
    })
    .then(() => {
      alert("Logged in with Google!");
      window.location.href = "main.html"; // 🔁 Redirect after Google login
    })
    .catch((error) => alert(error.message));
});
