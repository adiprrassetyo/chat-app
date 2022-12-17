// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAVITVGpaqBqttzjanPbhFF6M3Jk4d0qcU",
	authDomain: "chat-app-socket-io.firebaseapp.com",
	projectId: "chat-app-socket-io",
	storageBucket: "chat-app-socket-io.appspot.com",
	messagingSenderId: "433977311955",
	appId: "1:433977311955:web:2ed1d2f72ffe1854c60a26",
	measurementId: "G-FBGT77LZ51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
