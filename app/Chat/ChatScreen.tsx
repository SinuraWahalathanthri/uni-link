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
  Pressable,
} from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/main/Header";
import { Stack, useNavigation } from "expo-router";

export default function ChatScreen() {
  const navigation = useNavigation();

  const navigateToProfile = () => {
    navigation.navigate("Lecturer/LecturerProfile");
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Feather name="arrow-left" size={24} color="#333" />

       <Pressable onPress={navigateToProfile}>
         <Image
          source={require("../../assets/images/profileImage.png")}
          style={styles.profileImage}
        />
       </Pressable>
        <Pressable style={styles.profileInfo} onPress={navigateToProfile}>
          <View style={styles.row}>
            <Text style={styles.headerText}>Dr. Anil Fernando</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Lecturer</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaText}>Computer Science</Text>
          </View>
        </Pressable>

        <Feather name="phone" size={22} color="#333" style={styles.icon} />
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
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {dummyMessages.map((msg, index) => {
            const isMentor = msg.sender === "mentor";
            const readStatusIcon = msg.read ? "⬆️" : "⬇️"; // Or use icons
            return (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  { alignItems: isMentor ? "flex-start" : "flex-end" },
                ]}
              >
                {msg.imageUrl && (
                  <Image
                    source={{ uri: msg.imageUrl }}
                    style={styles.imageMessage}
                  />
                )}
                {msg.text && (
                  <View
                    style={[
                      styles.messageContainer,
                      isMentor ? styles.mentorMessage : styles.studentMessage,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.text}</Text>
                    <View style={styles.metaContainer}>
                      <Text style={styles.timeText}>{msg.time}</Text>
                      {!isMentor && (
                        <Ionicons
                          name="checkmark-done"
                          size={14}
                          color={isMentor ? "#1E88E5" : "#777"}
                          style={styles.statusIcon}
                        />
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.footerContainer}>
          <View style={styles.footer}>
            <TouchableOpacity>
              <Entypo name="plus" size={20} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo
                name="emoji-happy"
                size={20}
                color="#777"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                backgroundColor: "#1E88E5",
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Entypo name="paper-plane" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    color: "#333",
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
  messageText: {
    padding: 16,
    borderRadius: 8,
    overflow: "hidden",
    fontSize: 14,
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
    flexDirection: "row",
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
