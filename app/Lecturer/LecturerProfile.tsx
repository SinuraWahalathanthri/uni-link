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
  ActivityIndicator,
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getLecturer } from "@/services/StorageServices";

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

const ProfessorProfileScreen = () => {
  const navigation = useNavigation();
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

  const navigateToConsult = () => {
    navigation.navigate("Lecturer/BookingProcess", { lecturerId });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!lecturerData) {
    return <Text>Lecturer not found.</Text>;
  }

  const navigateToChat = (lecturerId: string) => {
    navigation.navigate("Chat/ChatScreen", { lecturerId });
  };


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

     
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{lecturerData.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View>
          <Image
            source={require("../../assets/images/main/cover.png")}
            style={styles.coverImage}
          />
          <Image
            source={
              lecturerData.profileImage === "no-image"
                ? require("../../assets/images/main/lecturer-1.png")
                : { uri: lecturerData.profileImage }
            }
            style={styles.profileImage}
          />
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.name}>{lecturerData.name}</Text>
          <Text style={styles.title}>{lecturerData.designation}</Text>
          <Text style={styles.department}>{lecturerData.department}</Text>
          <Text style={styles.faculty}>{lecturerData.faculty}</Text>

          <View style={styles.connectionRow}>
            <Text style={styles.linkText}>147+ connections</Text>
            <Text style={styles.mutualText}>Mutual Connections</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.connectBtn}>
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn} onPress={() => navigateToChat(lecturerId)}>
              <Text style={styles.chatText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

      
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Office Hours</Text>
          {lecturerData.office_hours?.map((slot, index) => (
            <View key={index}>
              <Text style={styles.sectionContent}>
                {slot.day.join(" & ")}: {slot.from} – {slot.to} ({slot.mode})
              </Text>
            </View>
          ))}
          <View style={styles.locationRow}>
            <Entypo name="location-pin" size={16} color="red" />
            <Text style={styles.sectionContent}>{lecturerData.office_location}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses and Subjects Taught</Text>
          {lecturerData.linkedSubjects?.map((subject, index) => (
            <Text key={index} style={styles.sectionContent}>
              • {subject}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biography / About</Text>
          <Text style={styles.sectionContent}>{lecturerData.biography}</Text>
        </View>
      </ScrollView>
      <View style={{ paddingBottom: Platform.OS === "android" ? 50 : 20 }}>
        <TouchableOpacity style={styles.consultBtn} onPress={navigateToConsult}>
          <Text style={styles.consultText}>Request Consultation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


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
    left: 20,
    bottom: -40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "LatoBold",
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontFamily: "LatoBold",
    marginTop: 5,
  },
  department: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lato",
    marginTop: 5,
  },
  faculty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "Lato",
    marginTop: 5,
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
    fontSize: 16,
    marginBottom: 6,
    fontFamily: "LatoBold",
  },
  sectionContent: {
    fontSize: 14,
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

export default ProfessorProfileScreen;
