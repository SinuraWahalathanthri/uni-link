import React from "react";
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
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";

export default function ProfessorProfileScreen() {

    const navigation = useNavigation();

    const navigateToConsult = () =>{
        navigation.navigate("Lecturer/BookingProcess");
    }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Prof. Kamal Ashoka</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        {/* <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Prof. Kamal Ashoka</Text>
          <View style={{ width: 24 }} />
        </View> */}

        <View>
          <Image
            source={require("../../assets/images/main/cover.png")}
            style={styles.coverImage}
          />
          <Image
            source={require("../../assets/images/main/lecturer-1.png")}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.name}>Prof. Kamal Ashoka</Text>
          <Text style={styles.title}>Senior lecture at Java Institute</Text>
          <Text style={styles.department}>
            Department of Computing & Information Systems
          </Text>
          <Text style={styles.faculty}>Faculty of Applied Sciences</Text>

          {/* Connections */}
          <View style={styles.connectionRow}>
            <Text style={styles.linkText}>147+ connections</Text>
            <Text style={styles.mutualText}>Mutual Connections</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.connectBtn}>
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatBtn}>
              <Text style={styles.chatText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Office Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Office hours</Text>
          <Text style={styles.sectionContent}>
            Monday & Wednesday: 10:00 AM – 12:00 PM
          </Text>
          <Text style={styles.sectionContent}>Friday: 2:00 PM – 4:00 PM</Text>
          <View style={styles.locationRow}>
            <Entypo name="location-pin" size={16} color="red" />
            <Text style={styles.sectionContent}>
              Room A-302, Computing Building
            </Text>
          </View>
        </View>

        {/* Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses and Subjects Taught</Text>
          <Text style={styles.sectionContent}>
            • CSC2032 - Data Structures & Algorithm
          </Text>
          <Text style={styles.sectionContent}>
            • CSC2032 - Data Structures & Algorithm
          </Text>
          <Text style={styles.sectionContent}>
            • CSC2032 - Data Structures & Algorithm
          </Text>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biography / About</Text>
          <Text style={styles.sectionContent}>
            "I’ve been teaching computer science for over 12 years, with a
            passion for algorithms and helping students grow..."
          </Text>
        </View>

        {/* Consultation Button */}
      </ScrollView>
      <TouchableOpacity style={styles.consultBtn} onPress={navigateToConsult}>
        <Text style={styles.consultText}>Request Consultation</Text>
      </TouchableOpacity>
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
