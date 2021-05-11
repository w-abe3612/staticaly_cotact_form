import firebase from 'firebase/app';
import 'firebase/functions';

const app = firebase.initializeApp({
  apiKey: "AIzaSyD4ZsCHHUL-u6lSbGAb5vXHLMjP4zMpgkE",
  authDomain: "contact-sending.firebaseapp.com",
  databaseURL: "https://contact-sending.firebaseio.com",
  projectId: "contact-sending",
  storageBucket: "contact-sending.appspot.com",
  messagingSenderId: "625374332183",
  appId: "1:625374332183:web:0f024b55a13fd89a06e352"
});

if (!firebase.apps.length) {
  firebase.initializeApp(app);
}
export const functions = firebase.functions();

