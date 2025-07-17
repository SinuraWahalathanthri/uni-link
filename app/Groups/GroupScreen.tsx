import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  SafeAreaView,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import DocumentCard from "@/components/main/DocumentCard";

export default function GroupScreen() {
  const dummyMessages = [
    {
      sender: "mentor",
      text: "Hi! How can I help you today?",
      imageUrl: null,
      time: "2:00 PM",
    },
    {
      sender: "me",
      text: "Can you explain the last lecture topic?",
      imageUrl: null,
      time: "2:00 PM",
    },
    {
      sender: "mentor",
      text: null,
      imageUrl: "https://via.placeholder.com/150",
      time: "2:00 PM",
    },
  ];

  const MessageCard = ({ name, role, time, message, likes }) => (
    <View style={styles.messageCard}>
      <View style={styles.row}>
        <Image
          source={require("../../assets/images/profileImage.png")}
          style={styles.creatorImage}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
      <Text style={styles.messageText}>{message}</Text>
      <View style={styles.messageFooter}>
        <View></View>
        {likes !== undefined && (
          <View style={styles.likeBar}>
            {/* <FontAwesome name="thumbs-up" size={16} color="#fbbf24" /> */}
            <Text style={{ marginLeft: 5 }}>👍</Text>
            <Text style={{ marginLeft: 5 }}>{likes}</Text>
          </View>
        )}
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Feather name="arrow-left" size={24} color="#333" />

        <Image
          source={require("../../assets/images/profileImage.png")}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <View style={styles.row}>
            <Text style={styles.headerText}>
              Software Application Development
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaText}>125 participants, 39 online</Text>
          </View>
        </View>

        <Feather
          name="more-vertical"
          size={22}
          color="#333"
          style={styles.icon}
        />
      </View>

      <ImageBackground
        source={require("../../assets/images/main/chat-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={{ backgroundColor: "#dbeafe" }}>
          <View style={styles.announcementBox}>
            <View style={styles.row}>
              <Text style={styles.headerText}>Announcement</Text>
            </View>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.metaText}>
                Student’s, we will be having a past paper discussion tommorow
                @5pm, so please stud...
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          style={{ flex: 2, padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <MessageCard
            name="Prof. Michael Chen"
            role="Lecturer • Mathematics"
            time="3:19 PM"
            message="Good Evening Students, We will be having the assessment for the subject next Friday, so make sure everyone studies and keeps. We might have a revision class tomorrow. If anyone has the past papers I shared last month, please share them to me, and I'll publish them in the group. Please refer to the pdfs below and join for the lectures please. Good Day!"
            likes={12}
          />
          <MessageCard
            name="Prof. Michael Chen"
            role="Lecturer • Mathematics"
            time="3:19 PM"
            message="Oh, and students please tell the others to join this group!"
            likes={undefined}
          />

          <DocumentCard />

          <MessageCard
            name="Prof. Michael Chen"
            role="Lecturer • Mathematics"
            time="3:19 PM"
            message="Oh, and students please tell the others to join this group!"
            likes={undefined}
          />

          {/* <View style={styles.pdfCard}>
            <Image
              source={require("../../assets/images/profileImage.png")}
              style={styles.pdfImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.pdfTitle}>
                Introduction to Software Design and Analysis - The basic
                Fundamentals - Conducted by Prof. Michael Chen
              </Text>
              <Text style={styles.pdfDetails}>5 pages • 227 KB • pdf</Text>
            </View>
          </View> */}
        </ScrollView>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <Text style={[styles.metaText, { textAlign: "center" }]}>
              Only Admins are allowed to message in this group
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ///message card
  announcementBox: {
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    margin: 10,
  },
  creatorImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 12,
  },
  messageCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  name: {
    fontWeight: "bold",
    fontFamily: "LatoBold",
    fontSize: 14,
    color: "#26874C",
  },
  role: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "LatoBold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Lato",
    lineHeight: 23,
    marginTop: 10,
    padding: 5,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
  },
  likeBar: {
    backgroundColor: "#fafafa",
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    position: "absolute",
  },
  pdfCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
  },
  pdfImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  pdfTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  pdfDetails: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  /////
  timeText: {
    fontSize: 10,
    color: "#555",
    marginRight: 6,
    marginBottom: 10,
  },

  statusIcon: {
    fontSize: 14,
    marginTop: -10,
    marginRight: 10,
  },

  metaContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  background: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#F3F3F3",
    paddingTop: Platform.OS === "android" ? 74 : 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#214F9A",
    fontFamily: "LatoBold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#1E88E5",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginLeft: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "500",
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  messageContainer: {
    marginVertical: 6,
    borderRadius: 8,
    maxWidth: "100%",
  },
  mentorMessage: {
    backgroundColor: "#e0dbd6",
    color: "#222",
  },
  studentMessage: {
    backgroundColor: "#d2e0fb",
    color: "#222",
  },
  imageMessage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 6,
  },
  footerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderColor: "#d9d4cf",
  },
  footer: {
    alignItems: "center",
  },
  textinputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
    alignItems: "center",
    height: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});
