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
  serverTimestamp,
  arrayUnion,
  deleteDoc,
  documentId,
} from "firebase/firestore";
import { Alert } from "react-native";

const auth = FIREBASE_AUTH;
const db = getFirestore(FIREBASE_APP);

export const getLecturers = async (
  searchText = "",
  faculty = "",
  userType = ""
) => {
  let q = collection(db, "lecturers");

  const conditions = [];
  if (faculty) conditions.push(where("faculty", "==", faculty));
  if (userType) conditions.push(where("userType", "==", userType));

  if (conditions.length > 0) {
    q = query(collection(db, "lecturers"), ...conditions);
  }

  const snapshot = await getDocs(q);

  const lecturers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return searchText
    ? lecturers.filter((lecturer) =>
        lecturer.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : lecturers;
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
};

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
};

export const registerParticipant = async (eventId, studentId) => {
  const q = query(
    collection(db, "event_participants"),
    where("event_id", "==", eventId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;

    await updateDoc(docRef, {
      participants: arrayUnion({
        student_id: studentId,
        joined_date: new Date(),
      }),
    });
  } else {
    const docRef = doc(collection(db, "event_participants"));
    await setDoc(docRef, {
      event_id: eventId,
      participants: [
        {
          student_id: studentId,
          joined_date: new Date(),
        },
      ],
    });
  }
};

export const getUserCommunities = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, "communities"));
    const allCommunities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return allCommunities.filter((community) =>
      community.members.some(
        (member) => member.id === userId && member.status !== "blocked"
      )
    );
  } catch (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
};

export const unregisterParticipant = async (eventId, studentId) => {
  const participantDocRef = doc(
    db,
    "event_participants",
    eventId,
    "participants",
    studentId
  );
  await deleteDoc(participantDocRef);
};

export const addNotification = async ({
  lecturer_id,
  message_description,
  message_text,
  reciever_type = "lecturer",
  related_id,
  related_type = "consultations",
  user_id,
}: {
  lecturer_id: string,
  message_description: string,
  message_text: string,
  reciever_type?: string,
  related_id: string,
  related_type?: string,
  user_id: string,
}) => {
  try {
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
      is_read: false,
      lecturer_id,
      message_description,
      message_text,
      reciever_type,
      related_id,
      related_type,
      timestamp: serverTimestamp(),
      user_id,
    });
    console.log("Notification added successfully");
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};

// export const getEvents = async () => {
//   const querySnapshot = await getDocs(collection(db, "events"));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

export const getConnectedLecturers = async (studentId) => {
  try {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("sender_id", "==", studentId));
    const querySnapshot = await getDocs(q);

    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const lecturerIds = [...new Set(messages
      .map(msg => msg.receiver_id)
      .filter(id => typeof id === "string" && id.length > 0)
    )];

    if (!lecturerIds.length) return [];

    const lecturersRef = collection(db, "lecturers");
    const lecturersQuery = query(
      lecturersRef,
      where(documentId(), "in", lecturerIds)
    );

    const lecturersSnap = await getDocs(lecturersQuery);

    const lecturers = lecturersSnap.docs.map(doc => {
      const unreadCount = messages.filter(
        msg => msg.receiver_id === doc.id && !msg.isRead
      ).length;

      return {
        id: doc.id,
        ...doc.data(),
        unreadCount,
      };
    });

    console.log(lecturers);
    return lecturers;
  } catch (error) {
    console.error("Error fetching connected lecturers:", error);
    throw error;
  }
};

