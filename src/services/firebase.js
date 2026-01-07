import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAq5ZhKNEo6XWqwQm-a1gsmctj0jvw_8Tc",
  authDomain: "foodlink-699ab.firebaseapp.com",
  projectId: "foodlink-699ab",
  storageBucket: "foodlink-699ab.firebasestorage.app",
  messagingSenderId: "750513582982",
  appId: "1:750513582982:web:ac075d21b18e9e67bbf207",
  measurementId: "G-CQ09RC6YYV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

async function createTestDocument() {
  try {
    await setDoc(doc(db, "users", "testUser"), {
      name: "Test Name",
      role: "Admin"
    });
    console.log("Document written! Check the Firestore Console.");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
createTestDocument();