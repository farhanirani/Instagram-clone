import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD7JdtaCyUUjbb19PJ_pSA5V_BVy2scvKo",
  authDomain: "instagram-clone-react-3aadc.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-3aadc.firebaseio.com",
  projectId: "instagram-clone-react-3aadc",
  storageBucket: "instagram-clone-react-3aadc.appspot.com",
  messagingSenderId: "311937830391",
  appId: "1:311937830391:web:438c3647a613d13cfd72f2",
  measurementId: "G-6MLXNL9P9F",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
