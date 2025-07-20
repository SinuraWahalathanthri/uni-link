import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SessionDetails() {
  const isOnline = true; // Change to false if physical

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={["#4F67FF", "#6CA4FF"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/men/45.jpg",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Prof. Kamal Ashoka</Text>
            <Text style={styles.designation}>Senior Lecturer</Text>
          </View>
          <TouchableOpacity style={styles.callIcon}>
            <Ionicons name="call" size={22} color="#4F67FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.sessionInfo}>
          <View style={styles.infoItem}>
            <Feather name="calendar" size={18} color="#fff" />
            <Text style={styles.infoText}>Monday, 1 March</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.infoItem}>
            <Feather name="clock" size={18} color="#fff" />
            <Text style={styles.infoText}>10:00 - 10:30</Text>
          </View>
        </View>

        <View style={styles.venue}>
          <Ionicons
            name={isOnline ? "globe-outline" : "location-outline"}
            size={20}
            color="#fff"
          />
          <Text style={styles.venueText}>
            {isOnline ? "Online Meeting" : "Room 100, Main Building"}
          </Text>
        </View>

        <TouchableOpacity style={styles.chatButton}>
          <Feather name="message-circle" size={18} color="#fff" />
          <Text style={styles.chatText}>Chat with Lecturer</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Description</Text>
          <Text style={styles.sectionDesc}>
            I want to clarify a few questions from last week’s lecture. I’ve
            also been having some issues with the assignment submission.
          </Text>
        </View>

        {isOnline && (
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Join Google Meet</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Remind Me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Feather name="share-2" size={22} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    fontFamily: "Poppins-Regular",
  },
  card: {
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  designation: {
    color: "#eee",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },
  callIcon: {
    marginLeft: "auto",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  sessionInfo: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
  },
  verticalLine: {
    height: 30,
    width: 1,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  venue: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 8,
  },
  venueText: {
    color: "#fff",
    fontSize: 14,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#6CA4FF",
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    gap: 8,
  },
  chatText: {
    color: "#fff",
    fontWeight: "500",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionDesc: {
    color: "#f0f0f0",
    fontSize: 13,
    lineHeight: 20,
  },
  joinButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  joinText: {
    color: "#4F67FF",
    fontWeight: "600",
    fontSize: 15,
  },
  actions: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionIcon: {
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
});
