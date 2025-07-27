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
import { getLecturer } from "@/services/StorageServices";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

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

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [preferedDate, setPreferredDate] = useState("");
  const [mode, setMode] = useState("Online");
  const [priority, setPriority] = useState("Normal");

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
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    } else {
      submitConsultationRequest();

      Animated.timing(bookingAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    const segmentWidth = 300 / 2;
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
    } 
    
    // else if (currentPage === 3) {
    //   return (
    //     <>
    //       <Step3 data={lecturerId} />
    //     </>
    //   );
    // }
  };

  const submitConsultationRequest = async () => {
    try {
      const consultationRef = collection(db, "consultations");

      await addDoc(consultationRef, {
        lecturer_id: lecturerId,
        student_id: "3WuducXGLzcsSTjiBKdQ",
        topic: topic,
        description: description,
        preferredDate: preferedDate,
        mode: mode,
        priority: priority,
        status: "pending",
        createdAt: new Date(),
      });

      Alert.alert("Success", "Consultation request submitted successfully.");
    } catch (error) {
      console.error("Error adding consultation:", error);
      Alert.alert("Error", "Failed to submit consultation request.");
    }
  };

  const navigation = useNavigation();
  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderPageIndicator = () => {
    const segmentWidth = 100 / 3;

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
          onPress={handleBack}
        />
        <Text style={styles.headerTitle}>Request For Consultation</Text>
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
        <Animated.View
          style={{
            width: "95%",
            position: "absolute",
            backgroundColor: "#3b3936",
            padding: 5,
            bottom: bookingAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 45],
            }),
            left: 16,
            borderRadius: 100,
            zIndex: 100,
            opacity: bookingAnim,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontFamily: "CanelaRegular",
              textAlign: "center",
              padding: 12,
            }}
          >
            You have a booking with a mentor at this time
          </Text>
        </Animated.View>
        {renderPageIndicator()}
        <View
          style={{
            paddingBottom: Platform.OS === "android" ? 50 : 20,
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
