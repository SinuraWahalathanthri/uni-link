import React, { useEffect, useRef, useState } from "react";
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
import { Stack, useNavigation } from "expo-router";
import DocumentCard from "@/components/main/DocumentCard";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import ImageCard from "@/components/main/ImageCard";
import LetterComponent from "@/components/chat/LetterComponent";
import AvatarComponent from "@/components/chat/AvatarComponent";
import { goBack } from "expo-router/build/global-state/routing";

export default function GroupScreen() {
  const RenderMessageCard = ({ message, showHeader }) => {
    const [senderInfo, setSenderInfo] = useState({
      name: message.user_name,
      role: "",
    });

    const formattedTime = message.timestamp?.toDate
      ? message.timestamp.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

    const fetchUserInfo = async (email) => {
      try {
        let q = query(collection(db, "admins"), where("email", "==", email));
        let snapshot = await getDocs(q);

        if (!snapshot.empty)
          return { ...snapshot.docs[0].data(), role: "Admin" };

        q = query(collection(db, "lecturers"), where("email", "==", email));
        snapshot = await getDocs(q);

        if (!snapshot.empty)
          return { ...snapshot.docs[0].data(), role: "Lecturer" };

        return { name: email, role: "Member" };
      } catch (error) {
        console.error("Error fetching user info:", error);
        return { name: email, role: "Member" };
      }
    };

    useEffect(() => {
      const loadInfo = async () => {
        const info = await fetchUserInfo(message.user_name);
        setSenderInfo({
          name: info.name || message.user_name,
          role: info.role,
        });
      };
      loadInfo();
    }, [message.user_name]);

    switch (message.type) {
      case "text":
        return (
          <MessageCard
            name={senderInfo.name}
            role={senderInfo.role}
            time={formattedTime}
            message={message.message_text}
            likes={message.likes}
            showHeader={showHeader}
          />
        );
      case "pdf":
        return (
          <DocumentCard
            name={senderInfo.name}
            role={senderInfo.role}
            time={formattedTime}
            fileUrl={message.file_url}
            profileImage={undefined}
          />
        );
      case "image":
        return (
          <ImageCard
            name={senderInfo.name}
            role={senderInfo.role}
            time={formattedTime}
            imageUrl={message.file_url}
          />
        );
      default:
        return null;
    }
  };

  const MessageCard = ({ name, role, time, message, likes, showHeader }) => (
    <View style={styles.messageCard}>
      {showHeader && (
        <View style={styles.row}>
          <AvatarComponent
            imageUrl={undefined}
            name={name}
            size={20}
            style={styles.creatorImage}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>
          </View>
        </View>
      )}
      <Text style={styles.messageText}>{message}</Text>
      <View style={styles.messageFooter}>
        <View />

        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );

  const route = useRoute();
  const { data, communityId, type, name, memberCount } = route.params;
  console.log(data, communityId, type, name, memberCount);

  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const q = query(
      collection(db, "community_messages"),
      where("community_id", "==", communityId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [communityId]);

  const navigation = useNavigation();
  const navigateToGroupInfo = () => {
    navigation.navigate("Groups/GroupDetails", { communityId, memberCount });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Feather
          name="arrow-left"
          size={24}
          color="#333"
          onPress={() => goBack()}
        />

        <LetterComponent imageUrl={undefined} type={type} style={undefined} />
        <TouchableOpacity
          style={styles.profileInfo}
          onPress={navigateToGroupInfo}
        >
          <View style={styles.row}>
            <Text style={styles.headerText}>{name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaText}>{memberCount} participants</Text>
          </View>
        </TouchableOpacity>

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
              <Text style={styles.headerText}>Group Description</Text>
            </View>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.metaText}>
                {data.description}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 2, padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => {
            const previousMsg = index > 0 ? messages[index - 1] : null;
            const isSameSender = previousMsg?.user_id === msg.user_id;

            return (
              <RenderMessageCard
                key={msg.id}
                message={msg}
                showHeader={!isSameSender}
              />
            );
          })}
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    maxWidth: "100%",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
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
    marginLeft: 5,
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
