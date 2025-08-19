import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import ConsultationReqList from "@/components/ConsultationReqList";
import CommonStyles from "@/constants/CommonStyles";

const db = getFirestore();

type ConsultationRequestType = {
  id: string;
  [key: string]: any;
};

const ConsultationRequest = () => {
  const [requests, setRequests] = useState<ConsultationRequestType[]>([]);
  const [emailFocused, setEmailFocused] = useState(false);
  const { lecturerData } = useLocalSearchParams();
  const lecturer =
    lecturerData
      ? JSON.parse(Array.isArray(lecturerData) ? lecturerData[0] : lecturerData)
      : null;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!lecturer?.docId) {
        console.warn("Lecturer data missing or invalid");
        return;
      }

      try {
        const q = query(
          collection(db, "consultations"),
          where("lecturer_id", "==", lecturer.docId)
        );

        const snapshot = await getDocs(q);
        const allRequests = [];

        for (const docSnap of snapshot.docs) {
          const consult = docSnap.data();
          const studentRef = doc(db, "students", consult.student_id);
          const studentSnap = await getDoc(studentRef);

          if (studentSnap.exists()) {
            allRequests.push({
              id: docSnap.id,
              ...consult,
              student: studentSnap.data(),
            });
          }
        }

        setRequests(allRequests);
      } catch (err) {
        console.error("Error fetching consultation requests:", err);
      }
    };

    fetchRequests();
  }, [lecturer]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "", headerShadowVisible: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Consultation Requests</Text>
            <Text style={styles.subTitle}>
              View All Consultation Requests from Students
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="menu-book" color="#ffffff" size={24} />
          </View>
        </View>

        {/* Search Input */}
        <View style={CommonStyles.inputContainer}>
          <View
            style={[
              CommonStyles.searchInputWrapper,
              emailFocused && CommonStyles.focusedInput,
            ]}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#777" />
            <TextInput
              style={CommonStyles.textInput}
              placeholder="Search requests by student name or ID"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>
        </View>

        {/* Requests List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20, gap: 16 }}
        >
          {requests.map((req) => (
            <ConsultationReqList key={req.id} data={req} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ConsultationRequest;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "LatoBold",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 29,
  },
  subTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#6B6B6B",
  },
  iconContainer: {
    padding: 10,
    backgroundColor: "#3D83F5",
    borderRadius: 4,
  },
  scrollView: {
    marginTop: 20,
  },
});
