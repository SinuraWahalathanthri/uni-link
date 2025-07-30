import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import AvatarComponent from "@/components/chat/AvatarComponent";
import { getLecturer } from "@/services/StorageServices";
import { ActivityIndicator } from "react-native-paper";

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

type Step3Props = {
  data: string;
  topic: string;
  description: string;
  preferredDates: string[];
  mode: string;
  priority: string;
};
export default function Step3({
  data,
  topic,
  description,
  preferredDates,
  mode,
  priority,
}: Step3Props) {
  const route = useRoute();
  const { lecturerId } = route.params as { lecturerId: string };
  const [lecturerData, setLecturerData] = useState<LectureItem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  const navigateToHome = () => {
    navigation.navigate("(tabs)");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={navigateToHome}
        />
        <Text style={styles.headerTitle}>Request Sent Successfully!!</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <View>
          <Image
            source={require("../../assets/images/main/cover.png")}
            style={styles.coverImage}
          />
          <AvatarComponent
            imageUrl={lecturerData?.profileImage}
            name={lecturerData?.name}
            size={58}
            style={[styles.profileImage]}
          />
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.name}>{lecturerData?.name}</Text>
          <Text style={styles.title}>{lecturerData?.designation}</Text>
          <Text style={styles.department}>{lecturerData?.department}</Text>
          <Text style={styles.faculty}>{lecturerData?.faculty}</Text>
        </View>
        <View style={styles.notificationContainer}>
          <View style={styles.topBox}>
            <View style={styles.iconCircleGreen}>
              <Entypo name="paper-plane" size={24} color="#22c55e" />
            </View>
            <Text style={styles.boxTitle}>Request Successfully Sent!</Text>
            <Text style={styles.boxDescription}>
              Your consultation request has been sent to{"\n"}
              {lecturerData?.name}
              {"\n"}
              Usually responds within 5 - 6 hours.
            </Text>
          </View>
          <View style={styles.bottomBox}>
            <Text style={styles.boxTitle2}>What Happens Next?</Text>
            <Text style={styles.boxDescription2}>
              • {lecturerData?.name} will review your consultation request.
              {"\n"}• You’ll receive a notification with the confirmed date,
              time, and meeting location (if a physical meeting is scheduled).
              {"\n"}• Detailed instructions and meeting information will be
              provided in advance. Stay updated through the app for any changes.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  textWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lato",
  },
  value: {
    fontSize: 16,
    fontFamily: "LatoBold",
    color: "#111",
  },
  submitBtn: {
    backgroundColor: "#2675EC",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "LatoBold",
  },

  ///
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    marginLeft:20,
    fontFamily: "LatoBold",
  },
  coverImage: {
    width: "100%",
    height: 160,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: "absolute",
    alignSelf: "center",
    bottom: -40,
    borderWidth: 3,
    borderColor: "#fff",
  },

  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "LatoBold",
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontFamily: "LatoBold",
    marginTop: 5,
    textAlign: "center",
  },
  department: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lato",
    marginTop: 5,
    textAlign: "center",
  },
  faculty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "Lato",
    marginTop: 5,
    textAlign: "center",
  },
  connectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  linkText: {
    color: "#007bff",
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  mutualText: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Lato",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  connectBtn: {
    flex: 1,
    backgroundColor: "#2675EC",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
  },
  connectText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  chatBtn: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    fontFamily: "LatoBold",
  },
  chatText: {
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 6,
    fontFamily: "LatoBold",
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 4,
    color: "#444",
    fontFamily: "Lato",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  consultBtn: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#2675EC",
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    fontFamily: "LatoBold",
  },
  consultText: {
    color: "#fff",
    fontWeight: "bold",
  },
  notificationContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginTop:-10,
  },
  topBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    padding: 16,
    alignItems: "center",
  },
  bottomBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 16,
    marginTop:-10,
    alignItems: "center",
  },
  iconCircleGreen: {
    backgroundColor: "#dcfce7",
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
  },
  iconCircleBlue: {
    backgroundColor: "#dbeafe",
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  boxTitle2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "left",
    marginBottom: 6,
  },
  boxDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    textAlign: "center",
  },
  boxDescription2: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    textAlign: "left",
  },
});
