// Firebase v9 Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB04ab3r-h3sX6qtyeTbm0yI_X1s6yERiw",
  authDomain: "hackathon2-9af58.firebaseapp.com",
  projectId: "hackathon2-9af58",
  storageBucket: "hackathon2-9af58.appspot.com",
  messagingSenderId: "526690056650",
  appId: "1:526690056650:web:6bead5068ea6b46e5ef733",
  measurementId: "G-L0VKKNMWLL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("involve-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const interest = document.getElementById("interest").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !interest || !message) {
    status.textContent = "Please fill out all fields.";
    status.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "getInvolvedForms"), {
      name,
      email,
      interest,
      message,
      timestamp: new Date()
    });

    form.reset();
    status.textContent = "Thanks for getting involved! We’ll be in touch.";
    status.style.color = "green";
  } catch (error) {
    console.error("Error submitting form:", error);
    status.textContent = "Something went wrong. Please try again.";
    status.style.color = "red";
  }
});
