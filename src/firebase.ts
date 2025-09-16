// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBKizJXSzcq8C90LQIygXRPIf2z9-ucCvY",
	authDomain: "bsurvivor-dd733.firebaseapp.com",
	projectId: "bsurvivor-dd733",
	storageBucket: "bsurvivor-dd733.firebasestorage.app",
	messagingSenderId: "232662812746",
	appId: "1:232662812746:web:47ca3e524f3ed51890beb3",
	measurementId: "G-34989X1M2P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Export the auth instance

// const analytics = getAnalytics(app);
