import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PanResponder,
  Easing,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import Step1 from "./Booking-Step1";
import Step2 from "./Booking-Step2";
import Step3 from "./Booking-Step3";
import { useRoute } from "@react-navigation/native";
import { addNotification, getLecturer } from "@/services/StorageServices";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { ActivityIndicator, Modal } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";

type LectureItem = {
  id: string;
  name: string;
  designation: string;
  profileImage: string;
  biography: string;
  department: string;
  email: string;
  faculty: string;
  google_meet_link: string;
  linkedSubjects: string[];
  office_hours: {
    day: string[];
    from: string;
    to: string;
    mode: string;
  }[];
  office_location: string;
};

export default function BookingProcess() {
  const route = useRoute();
  const { lecturerId } = route.params as { lecturerId: string };
  const [lecturerData, setLecturerData] = useState<LectureItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [preferedDate, setPreferredDate] = useState("");
  const [mode, setMode] = useState("Online");
  const [priority, setPriority] = useState("Normal");
  const { user } = useAuth();

  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        const data = await getLecturer(lecturerId);
        setLecturerData(data);
      } catch (error) {
        console.error("Failed to fetch lecturer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLecturer();
  }, [lecturerId]);

  const [currentPage, setCurrentPage] = useState(1);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [showBookingMessage, setShowBookingMessage] = useState(false);
  const bookingAnim = useRef(new Animated.Value(0)).current;

  const isNextDisabled = false;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50 && currentPage > 1) {
          handleBack();
        } else if (gestureState.dx < -50 && currentPage < 2) {
          handleNext();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (currentPage === 1) {
      if (!topic.trim() || !description.trim()) {
        Alert.alert(
          "Missing Information",
          "Please fill in both topic and description."
        );
        return;
      }
    }

    if (currentPage === 2) {
      if (!preferedDate || !mode || !priority) {
        Alert.alert(
          "Missing Information",
          "Please fill in all booking details."
        );
        return;
      }
      setShowConfirmSheet(true);
      return;
    }

    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      setShowConfirmSheet(true);
      Animated.timing(bookingAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    const segmentWidth = 100 / 3;

    Animated.timing(progressAnim, {
      toValue: segmentWidth * (currentPage - 1),
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentPage]);

  console.log("Lecturer Data:", topic, description);
  console.log("Lecturer Data:", preferedDate, mode, priority);

  const renderContent = () => {
    if (currentPage === 1) {
      return (
        <>
          <Step1
            data={lecturerId}
            setTopic={setTopic}
            setDescription={setDescription}
          />
        </>
      );
    } else if (currentPage === 2) {
      return (
        <>
          <Step2
            data={lecturerId}
            setPreferredDate={setPreferredDate}
            setMode={setMode}
            setPriority={setPriority}
          />
        </>
      );
    } else if (currentPage === 3) {
      return (
        <>
          <Step3
            data={lecturerId}
            preferredDates={preferedDate ? [preferedDate] : []}
            mode={mode}
            priority={priority}
            topic={topic}
            description={description}
          />
        </>
      );
    }
  };

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const submitConsultationRequest = async () => {
    if (
      !topic.trim() ||
      !description.trim() ||
      !preferedDate ||
      (Array.isArray(preferedDate) && preferedDate.length === 0) ||
      !mode.trim() ||
      !priority.trim()
    ) {
      Alert.alert("Error", "All fields are required before submitting.");
      return;
    }

    try {
      setLoadingSubmit(true);
      const consultationRef = collection(db, "consultations");
      const docRef = await addDoc(consultationRef, {
        lecturer_id: lecturerId,
        student_id: user?.id,
        topic,
        description,
        preferredDate: preferedDate,
        mode,
        priority,
        status: "pending",
        createdAt: new Date(),
      });

      await addNotification({
        lecturer_id: lecturerId,
        message_description: "You have a new consultation request by student",
        message_text: `New Consultation Request by ${user?.name}`,
        reciever_type: "lecturer",
        related_id: docRef.id,
        related_type: "consultations",
        user_id: user?.id ?? "",
      });

      Alert.alert("Success", "Consultation request submitted successfully.", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("Lecturer/Booking-Step3", { lecturerId }),
        },
      ]);
    } catch (error) {
      console.error("Error adding consultation:", error);
      Alert.alert("Error", "Failed to submit consultation request.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const navigation = useNavigation();
  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageIndicator = () => {
    const segmentWidth = 100 / 2;

    return (
      <View style={styles.pageIndicatorContainer}>
        <View style={styles.pageIndicatorBackground} />
        <Animated.View
          style={[
            styles.pageIndicatorSegment,
            {
              width: `${segmentWidth}%`,
              transform: [
                {
                  translateX: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 100],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Request Consultation</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container2}>
        <View style={{ marginTop: 0 }} />
        <ScrollView
          {...panResponder.panHandlers}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {renderContent()}
        </ScrollView>
      </View>
      <View style={styles.container3}>
        {renderPageIndicator()}
        <View
          style={{
            paddingBottom: Platform.OS === "android" ? 50 : 0,
            marginLeft: "auto",
          }}
        >
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                isNextDisabled && { backgroundColor: "#d8d8d8" },
              ]}
              onPress={handleNext}
              disabled={isNextDisabled}
            >
              <Text
                style={[styles.buttonText, isNextDisabled && { color: "grey" }]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={showConfirmSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmSheet(false)}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {loadingSubmit ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View
              style={{
                width: "90%",
                backgroundColor: "#fff",
                padding: 25,
                borderRadius: 20,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "LatoBold",
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#333",
                }}
              >
                Confirm Consultation Request
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "Lato",
                  textAlign: "center",
                  color: "#666",
                  marginBottom: 25,
                }}
              >
                Do you want to confirm consultation request with{" "}
                {lecturerData?.name}?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    backgroundColor: "#aaa",
                    borderRadius: 50,
                    width: "45%",
                    alignItems: "center",
                  }}
                  onPress={() => setShowConfirmSheet(false)}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    backgroundColor: "#3D83F5",
                    borderRadius: 50,
                    width: "45%",
                    alignItems: "center",
                  }}
                  onPress={submitConsultationRequest}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontFamily: "Lato" }}
                  >
                    Yes Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#F3F3F3",
    paddingTop: Platform.OS === "android" ? 74 : 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "LatoBold",
  },
  pageIndicatorContainer: {
    height: 5,
    marginBottom: 10,
    marginVertical: 5,
    position: "relative",
    backgroundColor: "transparent",
  },
  pageIndicatorBackground: {
    width: "100%",
    height: 5,
    borderRadius: 10,
    backgroundColor: "#efece8",
    position: "absolute",
  },
  pageIndicatorSegment: {
    height: 11,
    marginTop: -4,
    borderRadius: 10,
    backgroundColor: "#2675EC",
    position: "absolute",
    borderWidth: 3,
    borderColor: "white",
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
    // padding: 16,
  },
  container3: {
    justifyContent: "flex-end",
    backgroundColor: "white",
    marginBottom: -10,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    minWidth: 120,
    backgroundColor: "#2675EC",
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  backButton: {
    minWidth: 120,
    backgroundColor: "#2675EC",
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "CanelaRegular",
    marginTop: 5,
  },
});
