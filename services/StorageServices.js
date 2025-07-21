import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { FIREBASE_APP, FIREBASE_AUTH } from "./FirebaseConfig";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";

const auth = FIREBASE_AUTH;
const db = getFirestore(FIREBASE_APP);

export const getLecturers = async () => {
  const querySnapshot = await getDocs(collection(db, "lecturers"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getLecturer = async (id) => {
  try {
    const docRef = doc(db, "lecturers", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) { 
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("No matching Mentor found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return null;
  }
}