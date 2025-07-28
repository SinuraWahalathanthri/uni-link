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
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { Alert } from "react-native";

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

export const getEvent = async (id) => {
  try {
    const docRef = doc(db, "events", id);
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

export const handleRegisterParticipant = async (id) => {
  try {
    const eventRef = doc(db, "event_participants", id); 
    const eventSnap = await getDoc(eventRef);

    const newMember = {
      student_id: "88758756vhfgy5",
      joined_at: Timestamp.now(),
    };

    if (eventSnap.exists()) {
      await updateDoc(eventRef, {
        members: arrayUnion(newMember),
      });
    } else {
      await setDoc(eventRef, {
        event_id: eventData.id,
        members: [newMember],
      });
    }
    Alert.alert("Success", "You've been registered!");
    setModalVisible(false);
  } catch (error) {
    console.error("Registration failed", error);
    Alert.alert("Error", "Something went wrong.");
  }
};

// export const getEvents = async () => {
//   const querySnapshot = await getDocs(collection(db, "events"));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };