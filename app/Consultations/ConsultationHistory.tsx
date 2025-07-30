import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";

type Session = {
  id: string;
  lecturerName: string;
  role: string;
  department: string;
  faculty: string;
  date: string;
  time: string;
  mode: "Physical" | "Online";
  location?: string;
  meetingLink?: string;
  status: "Upcoming" | "Completed" | "Requested";
};

const sessions: Session[] = [
  {
    id: "1",
    lecturerName: "Prof. Kamal Ashoka",
    role: "Senior Lecturer",
    department: "Computer Science",
    faculty: "Engineering",
    date: "Monday, 1 March",
    time: "10:00 - 10:30",
    mode: "Physical",
    location: "Room A-203, Main Campus",
    status: "Upcoming",
  },
  {
    id: "2",
    lecturerName: "Dr. Emma White",
    role: "Lecturer",
    department: "Mathematics",
    faculty: "Science",
    date: "Friday, 26 July",
    time: "02:00 - 02:30",
    mode: "Online",
    meetingLink: "https://meet.google.com/abc-xyz",
    status: "Completed",
  },
  {
    id: "3",
    lecturerName: "Dr. Alan Walker",
    role: "Professor",
    department: "Biology",
    faculty: "Medicine",
    date: "Saturday, 10 Aug",
    time: "11:00 - 11:30",
    mode: "Online",
    meetingLink: "https://meet.google.com/def-uvw",
    status: "Requested",
  },
];

export default function SessionHistoryScreen() {
  const [selectedTab, setSelectedTab] = useState<"Upcoming" | "Completed" | "Requested">("Upcoming");

  const filteredSessions = sessions.filter((item) => item.status === selectedTab);

  const renderCard = ({ item }: { item: Session }) => (
    <TouchableOpacity style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.profileRow}>
          <Image
            source={require("../../assets/images/main/lecturer-1.png")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{item.lecturerName}</Text>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.subText}>{item.department} • {item.faculty}</Text>
          </View>
        </View>
        {item.mode === "Online" && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Joining:", item.meetingLink)}
          >
            <MaterialIcons name="videocam" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.iconText}>
          <Feather name="calendar" color="white" size={18} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.iconText}>
          <MaterialIcons name="access-time" color="white" size={20} />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
      </View>

      {item.mode === "Physical" && (
        <Text style={styles.locationText}>📍 {item.location}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9", padding: 12 }}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Upcoming", "Completed", "Requested"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab as any)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={styles.emptyText}>No sessions</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  activeTab: {
    backgroundColor: "#4E72E3",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#4E72E3",
    shadowColor: "#00D0FF",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  role: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
    fontFamily: "Poppins",
  },
  subText: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
    fontFamily: "Poppins",
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 999,
  },
  divider: {
    height: 20,
    width: 4,
    backgroundColor: "#6279bd",
    borderRadius: 10,
  },
  bottomRow: {
    flexDirection: "row",
    backgroundColor: "#3B57AD",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: "space-between",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
    fontFamily: "Poppins",
  },
  locationText: {
    marginTop: 8,
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },
});
