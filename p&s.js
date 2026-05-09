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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Initialize Leaflet map
let map;
let marker;

// Function to initialize the map with a default or dynamic location
function initMap(lat = 20.5937, lng = 78.9629) {
  const location = [lat, lng];

  // Create the map
  map = L.map('map').setView(location, 14);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add marker for the location
  if (marker) {
    marker.setLatLng(location);
  } else {
    marker = L.marker(location).addTo(map).bindPopup("Your Location").openPopup();
  }
}

// Handle SOS Button with Auth Check and Location
firebase.auth().onAuthStateChanged((user) => {
  document.getElementById('sos-button').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const sosData = {
            type: "SOS",
            timestamp: new Date().toISOString(),
            userEmail: user ? user.email : "Anonymous",
            location: {
              latitude: lat,
              longitude: lng
            }
          };

          db.collection("safetyAlerts").add(sosData)
            .then(() => {
              document.getElementById('sos-confirmation').style.display = "block";
              setTimeout(() => {
                document.getElementById('sos-confirmation').style.display = "none";
              }, 3000);
            })
            .catch((error) => {
              console.error("❌ Error sending SOS alert:", error);
            });

          // Update map with new location
          initMap(lat, lng);
        },
        (error) => {
          console.error("❌ Error getting location:", error.message);
          alert("Unable to access your location. Please enable location services or check your browser settings.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });
});

// Handle Anonymous Report Submit
document.getElementById('report-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const message = document.getElementById('report-text').value.trim();
  if (!message) return;

  const reportData = {
    type: "Anonymous Report",
    timestamp: new Date().toISOString(),
    message: message
  };

  db.collection("safetyAlerts").add(reportData)
    .then(() => {
      document.getElementById('report-confirmation').style.display = "block";
      document.getElementById('report-text').value = '';
      setTimeout(() => {
        document.getElementById('report-confirmation').style.display = "none";
      }, 3000);
    })
    .catch((error) => {
      console.error("❌ Error submitting anonymous report:", error);
    });
});