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
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/main/Header";
import { Stack, useNavigation } from "expo-router";
import { db } from "@/services/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { getLecturer } from "@/services/StorageServices";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { goBack } from "expo-router/build/global-state/routing";
import { useAuth } from "@/context/AuthContext";
import * as ImageManipulator from "expo-image-manipulator";
import AvatarComponent from "@/components/chat/AvatarComponent";

type Message = {
  id: string;
  sender_id?: string;
  receiver_id?: string;
  messageType?: string;
  text?: string | null;
  imageUrl?: string | null;
  createdAt?: any;
  isRead?: boolean;
  [key: string]: any;
};

const CLOUDINARY_URL_BASE = "https://api.cloudinary.com/v1_1/dudwypfcf";
const IMAGE_UPLOAD_PRESET = "unilink";
const PDF_UPLOAD_PRESET = "unilink-docs";

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lecturerId } = route.params as { lecturerId: string };
  const { user } = useAuth();

  const [lecturerData, setLecturerData] = useState<{
    id: string;
    name?: string;
    designation?: string;
    department?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);

  const scrollViewRef = useRef(null);
  const student_id = user?.id;

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

  useEffect(() => {
    if (!lecturerId || !student_id) return;

    const q = query(
      collection(db, "messages"),
      where("sender_id", "in", [student_id, lecturerId]),
      where("receiver_id", "in", [student_id, lecturerId]),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(chatData);

      chatData.forEach(async (message) => {
        if (message.receiver_id === student_id && !message.isRead) {
          const messageRef = doc(db, "messages", message.id);
          await updateDoc(messageRef, { isRead: true });
        }
      });
    });

    return () => unsubscribe();
  }, [lecturerId]);

  const handleSendMessage = async () => {
    if (!messageText.trim() && !imageUrl) return;

    const newMessage = {
      sender_id: student_id,
      receiver_id: lecturerId,
      messageType:
        imageUrl && messageText ? "image_text" : imageUrl ? "image" : "text",
      text: messageText || null,
      imageUrl: imageUrl || null,
      createdAt: serverTimestamp(),
      isRead: false,
    };

    try {
      await addDoc(collection(db, "messages"), newMessage);
      setMessageText("");
      setImageUrl(null);
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setDeleteModalVisible(true);
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    try {
      await deleteDoc(doc(db, "messages", selectedMessage.id));
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== selectedMessage.id)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);

      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );

      const uploadedUrl = await uploadFileToCloudinary(compressed, true);
      if (uploadedUrl) setImageUrl(uploadedUrl);
      setLoading(false);
    }
  };

  const uploadFileToCloudinary = async (file, isImage = true) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.fileName || `upload.${isImage ? "jpg" : "pdf"}`,
      type: file.mimeType || (isImage ? "image/jpeg" : "application/pdf"),
    });

    formData.append(
      "upload_preset",
      isImage ? IMAGE_UPLOAD_PRESET : PDF_UPLOAD_PRESET
    );
    formData.append("folder", isImage ? "images/profile-images" : "docs/pdfs");

    try {
      const response = await axios.post(
        `${CLOUDINARY_URL_BASE}/${isImage ? "image" : "raw"}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error(
        "Cloudinary upload failed",
        error.response?.data || error.message
      );
      Alert.alert("Upload failed", "Please try again later.");
      return null;
    }
  };

  const navigateToProfile = () => {
    navigation.navigate("Lecturer/LecturerProfile", { lecturerId });
  };

  const handleImagePress = (url: string) => {
    setPreviewImageUrl(url);
    setIsImagePreviewVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <Pressable onPress={navigateToProfile}>
          <AvatarComponent
            imageUrl={lecturerData?.profileImage}
            name={lecturerData?.name}
            size={20}
            style={styles.profileImage}
          />
        </Pressable>
        <Pressable style={styles.profileInfo} onPress={navigateToProfile}>
          <View style={styles.row}>
            <Text style={styles.headerText}>{lecturerData?.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{lecturerData?.designation}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.metaText}>{lecturerData?.department}</Text>
          </View>
        </Pressable>
        {/* 
        <TouchableOpacity onPress={() => Linking.openURL("tel:0774872229")}>
          <Feather name="phone" size={22} color="#333" style={styles.icon} />
        </TouchableOpacity> */}

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
          {messages.map((msg, index) => {
            const isMentor = msg.sender_id === lecturerId;
            const readStatusIcon = msg.isRead ? "⬆️" : "⬇️";

            const formattedTime = msg.createdAt?.toDate
              ? msg.createdAt.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.messageContainer,
                  { alignItems: isMentor ? "flex-start" : "flex-end" },
                ]}
                onLongPress={() => handleLongPress(msg)}
              >
                {msg.imageUrl && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleImagePress(msg.imageUrl!)}
                    >
                      <Image
                        source={{ uri: msg.imageUrl }}
                        style={styles.imageMessage}
                      />
                      <View style={styles.metaContainer}>
                        <Text style={styles.timeText}>{formattedTime}</Text>
                        {!isMentor && (
                          <Ionicons
                            name="checkmark-done"
                            size={14}
                            color={msg.isRead ? "#1E88E5" : "#777"}
                            style={styles.statusIcon}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </>
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
                      <Text style={styles.timeText}>{formattedTime}</Text>
                      {!isMentor && (
                        <Ionicons
                          name="checkmark-done"
                          size={14}
                          color={msg.isRead ? "#1E88E5" : "#777"}
                          style={styles.statusIcon}
                        />
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.footerContainer}>
          {imageUrl && (
            <View
              style={[
                styles.imagePreviewContainer,
                { alignSelf: "flex-start" },
              ]}
            >
              <TouchableOpacity
                onPress={() => setImageUrl(null)}
                style={styles.cancelButton}
              >
                <Entypo name="cross" size={15} color="black" />
              </TouchableOpacity>
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleImageUpload}>
              <Entypo name="plus" size={20} color="#777" />
            </TouchableOpacity>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={messageText}
                onChangeText={setMessageText}
              />
            </View>
            <TouchableOpacity
              style={{
                marginLeft: 10,
                backgroundColor: "#1E88E5",
                borderRadius: 20,
                padding: 8,
              }}
              onPress={handleSendMessage}
            >
              <Entypo name="paper-plane" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={isImagePreviewVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setIsImagePreviewVisible(false)}
            style={{ position: "absolute", top: 40, right: 20, zIndex: 1 }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          {previewImageUrl && (
            <Image
              source={{ uri: previewImageUrl }}
              style={{ width: "90%", height: "70%", borderRadius: 12 }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModal}>
            <Text style={styles.deleteText}>Delete this message?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.cancelText2}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteMessage}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "LatoBold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: -10,
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

  imagePreviewContainer: {
    padding: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: -14,
    marginBottom: -10,
    marginLeft: -14,
  },

  cancelButton: {
    position: "absolute",
    top: 10,
    right: 25,
    zIndex: 1,
    padding: 2,
    borderRadius: 100,
    backgroundColor: "#fafafa",
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },

  ////Delete Modal Styles
  deleteModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: { fontSize: 16, marginBottom: 20, fontFamily: "Lato" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 50,
  },
  cancelText2: { color: "gray", fontSize: 16, fontFamily: "Lato" },
  deleteButton: { color: "red", fontSize: 16, fontFamily: "Lato" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
});
