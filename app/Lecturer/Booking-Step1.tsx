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
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import CommonStyles from "@/constants/CommonStyles";
import { useRoute } from "@react-navigation/native";
import { getLecturer } from "@/services/StorageServices";
import AvatarComponent from "@/components/chat/AvatarComponent";

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

type Step1Props = {
  data: string;
  setTopic: (value: string) => void;
  setDescription: (value: string) => void;
};

export default function Step1({ data, setTopic, setDescription }: Step1Props) {
  const [localTopic, updateLocalTopic] = useState("");
  const [localDescription, updateLocalDescription] = useState("");

  useEffect(() => {
    setTopic(localTopic);
  }, [localTopic]);

  useEffect(() => {
    setDescription(localDescription);
  }, [localDescription]);

  const route = useRoute();
  const { lecturerId } = route.params as { lecturerId: string };

  const [lecturerData, setLecturerData] = useState<LectureItem | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!lecturerData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 100 }}>
          Lecturer not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View>
            <Image
              source={require("../../assets/images/main/cover.png")}
              style={styles.coverImage}
            />
            <AvatarComponent
            imageUrl={lecturerData.profileImage}
            name={lecturerData.name}
            size={58}
            style={[styles.profileImage]}
          />
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.name}>{lecturerData.name}</Text>
            <Text style={styles.title}>{lecturerData.designation}</Text>
            <Text style={styles.department}>{lecturerData.department}</Text>
            <Text style={styles.faculty}>{lecturerData.faculty}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              What would you like to discuss?
            </Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.sectionContent}>Topic/Subject*</Text>
              <View style={CommonStyles.inputContainer}>
                <View style={CommonStyles.emailInputWrapperWhite}>
                  <TextInput
                    style={CommonStyles.textInput}
                    placeholder="e.g Research related ..."
                    placeholderTextColor="#777"
                    value={localTopic}
                    onChangeText={updateLocalTopic}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionContent}>Description*</Text>
              <View style={CommonStyles.inputContainer}>
                <View
                  style={[CommonStyles.emailInputWrapperWhite, { height: 188 }]}
                >
                  <TextInput
                    style={[CommonStyles.textInput, { height: "100%" }]}
                    multiline
                    numberOfLines={10}
                    textAlignVertical="top"
                    placeholder="e.g. Please describe what you'd like to discuss about*"
                    placeholderTextColor="#777"
                    value={localDescription}
                    onChangeText={updateLocalDescription}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
