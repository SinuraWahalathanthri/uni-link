import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
  TextInput,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { db, FIREBASE_APP } from "@/services/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import CommonStyles from "@/constants/CommonStyles";
import { ImageManipulator } from "expo-image-manipulator";
import axios from "axios";
export const storage = getStorage(FIREBASE_APP);

const CLOUDINARY_URL_BASE = "https://api.cloudinary.com/v1_1/dudwypfcf";
const IMAGE_UPLOAD_PRESET = "unilink";
const PDF_UPLOAD_PRESET = "unilink-docs";



export default function CreatePostScreen() {
  const [postType, setPostType] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const handleCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error using camera:", error);
      Alert.alert("Error", "Failed to take photo.");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: handleCamera },
      { text: "Photo Library", onPress: handleImagePicker },
      { text: "Cancel", style: "cancel" },
    ]);
  };


  const uploadFileToCloudinary = async (fileUri: string, isImage = true) => {
    const formData = new FormData();

    formData.append("file", {
      uri: fileUri,
      name: `upload.${isImage ? "jpg" : "pdf"}`,
      type: isImage ? "image/jpeg" : "application/pdf",
    } as any);

    formData.append("upload_preset", isImage ? IMAGE_UPLOAD_PRESET : PDF_UPLOAD_PRESET);
    formData.append("folder", isImage ? "images/profile-images" : "docs/pdfs");

    try {
      const response = await axios.post(
        `${CLOUDINARY_URL_BASE}/${isImage ? "image" : "raw"}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.secure_url;
    } catch (error: any) {
      console.error("Cloudinary upload failed", error.response?.data || error.message);
      Alert.alert("Upload failed", "Please try again later.");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description.");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter the location.");
      return;
    }
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to create a post.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (selectedImage) {
        imageUrl = await uploadFileToCloudinary(selectedImage, true);
      }

      const docRef = await addDoc(collection(db, "lost_and_found"), {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        type: postType,
        imageUrl,
        userId: user.id,
        userEmail: user.email || "",
        datePosted: serverTimestamp(),
        status: "active",
      });

      Alert.alert("Success", "Your post has been created!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Error creating post:", error);
      Alert.alert("Error", `Failed to create post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
    const goBack = () => {
        navigation.goBack();
    };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#3A3A3A" />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Create Post</Text>
            <Text style={styles.subTitle}>Help others find their items</Text>
          </View>
        </View>

        {/* Post Type Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What are you reporting?</Text>
          <View style={styles.typeContainer}>
            <Pressable
              style={[
                styles.typeButton,
                postType === "lost" && styles.activeTypeButton,
              ]}
              onPress={() => setPostType("lost")}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color={postType === "lost" ? "#ffffff" : "#FF6B35"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  postType === "lost" && styles.activeTypeButtonText,
                ]}
              >
                Lost Item
              </Text>
              <Text
                style={[
                  styles.typeButtonSubtext,
                  postType === "lost" && styles.activeTypeButtonSubtext,
                ]}
              >
                I lost something
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.typeButton,
                postType === "found" && styles.activeTypeButton,
              ]}
              onPress={() => setPostType("found")}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color={postType === "found" ? "#ffffff" : "#16a34a"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  postType === "found" && styles.activeTypeButtonText,
                ]}
              >
                Found Item
              </Text>
              <Text
                style={[
                  styles.typeButtonSubtext,
                  postType === "found" && styles.activeTypeButtonSubtext,
                ]}
              >
                I found something
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Title Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Item Title *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder={`What did you ${postType}? (e.g., "Black iPhone 13", "Red Backpack")`}
              placeholderTextColor="#999999"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>
          <Text style={styles.characterCount}>{title.length}/100</Text>
        </View>

        {/* Description Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder={`Describe the item in detail. Include brand, color, size, distinctive features, etc.`}
              placeholderTextColor="#999999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>

        {/* Location Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Location *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#777777"
            />
            <TextInput
              style={[styles.textInput, { marginLeft: 8 }]}
              placeholder={`Where was it ${postType}? (e.g., "Library 2nd floor", "Cafeteria")`}
              placeholderTextColor="#999999"
              value={location}
              onChangeText={setLocation}
              maxLength={100}
            />
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Photo (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Adding a photo helps others identify the item more easily
          </Text>

          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
              <Pressable
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <MaterialIcons name="close" size={20} color="#ffffff" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.imageUploadButton}
              onPress={showImageOptions}
            >
              <MaterialCommunityIcons
                name="camera-plus"
                size={32}
                color="#777777"
              />
              <Text style={styles.imageUploadText}>Add Photo</Text>
            </Pressable>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Pressable
            style={[
              styles.submitButton,
              (!title.trim() ||
                !description.trim() ||
                !location.trim() ||
                loading) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              !title.trim() ||
              !description.trim() ||
              !location.trim() ||
              loading
            }
          >
            {loading  ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="publish" size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>
                  Post {postType.charAt(0).toUpperCase() + postType.slice(1)}{" "}
                  Item
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ececec",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "LatoBold",
    fontSize: 24,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  subTitle: {
    marginTop: 4,
    fontFamily: "Lato",
    fontSize: 14,
    color: "#6B6B6B",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "LatoBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3A3A",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: "Lato",
    fontSize: 13,
    color: "#777777",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ececec",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  activeTypeButton: {
    borderColor: "#3D83F5",
    backgroundColor: "#3D83F5",
  },
  typeButtonText: {
    fontFamily: "LatoBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3A3A",
    marginTop: 8,
  },
  activeTypeButtonText: {
    color: "#ffffff",
  },
  typeButtonSubtext: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#777777",
    marginTop: 2,
  },
  activeTypeButtonSubtext: {
    color: "#ffffff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  textInput: {
    flex: 1,
    fontFamily: "Lato",
    fontSize: 16,
    color: "#3A3A3A",
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    minHeight: 100,
  },
  textArea: {
    fontFamily: "Lato",
    fontSize: 16,
    color: "#3A3A3A",
    minHeight: 76,
  },
  characterCount: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#999999",
    textAlign: "right",
    marginTop: 4,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#ececec",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  imageUploadText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
  },
  submitContainer: {
    paddingVertical: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  submitButton: {
    backgroundColor: "#3D83F5",
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#CCCCCC",
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
});
