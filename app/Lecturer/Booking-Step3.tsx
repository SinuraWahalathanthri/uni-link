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
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Stack } from "expo-router";

export default function Step3() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Request Successfully Sent!</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Cover + Profile Image */}
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

          {/* Profile Details */}
          <View style={styles.profileContainer}>
            <Text style={styles.name}>Prof. Kamal Ashoka</Text>
            <Text style={styles.subtitle}>Senior Lecturer at Java Institute</Text>
            <Text style={styles.department}>
              Department of Computing & Information Systems
            </Text>
            <Text style={styles.faculty}>Faculty of Applied Sciences</Text>
          </View>

          {/* Notification Boxes */}
          <View style={styles.notificationContainer}>
            {/* Top Box */}
            <View style={styles.topBox}>
              <View style={styles.iconCircleGreen}>
                <Entypo name="paper-plane" size={24} color="#22c55e" />
              </View>
              <Text style={styles.boxTitle}>Request Successfully Sent!</Text>
              <Text style={styles.boxDescription}>
                Your consultation request has been sent to{"\n"}
                Prof. Kamal Ashoka.{"\n"}
                Usually responds within 5 - 6 hours.
              </Text>
            </View>

            {/* Bottom Box */}
            <View style={styles.bottomBox}>
            
              <Text style={styles.boxTitle2}>What Happens Next?</Text>
              <Text style={styles.boxDescription2}>
                Prof. Kamal Ashoka will review your request.{"\n"}
                You'll receive an email with the scheduled time.{"\n"}
                Meeting details will be provided in advance.
              </Text>
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
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 70 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  coverImage: {
    width: "100%",
    height: 160,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "absolute",
    alignSelf: "center",
    bottom: -60,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  profileContainer: {
    paddingTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  department: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  faculty: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  notificationContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 20,
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

