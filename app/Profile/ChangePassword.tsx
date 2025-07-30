import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigation = useNavigation();
 const { user } = useAuth(); 

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
      const studentRef = doc(db, "students", user.id); 
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        Alert.alert("Error", "Student record not found.");
        return;
      }

      const studentData = studentSnap.data();

      if (studentData.password !== currentPassword) {
        Alert.alert("Error", "Current password is incorrect.");
        return;
      }

      await updateDoc(studentRef, {
        password: newPassword,
      });

      Alert.alert("Success", "Password updated successfully!");
      navigation.goBack();

    } catch (error) {
      console.error("Password update error:", error);
      Alert.alert("Error", "Failed to update password. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderColor: "#F3F3F3",
            paddingTop: Platform.OS === "android" ? 74 : 50,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: "LatoBold",
            }}
          >
            Change Password
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: 20,
            justifyContent: "center",
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              marginBottom: 20,
              position: "relative",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Current Password
            </Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              placeholder="Enter current password"
              placeholderTextColor="#999"
              style={{
                backgroundColor: "#f8f8f8",
                borderRadius: 12,
                padding: 14,
                paddingRight: 40,
                borderWidth: 1,
                borderColor: "#ddd",
                fontSize: 16,
                color: "#333",
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 10, top: 40 }}
              onPress={() => setShowCurrent(!showCurrent)}
            >
              <Ionicons
                name={showCurrent ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View
            style={{
              marginBottom: 20,
              position: "relative",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              New Password
            </Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="Enter new password"
              placeholderTextColor="#999"
              style={{
                backgroundColor: "#f8f8f8",
                borderRadius: 12,
                padding: 14,
                paddingRight: 40,
                borderWidth: 1,
                borderColor: "#ddd",
                fontSize: 16,
                color: "#333",
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 10, top: 40 }}
              onPress={() => setShowNew(!showNew)}
            >
              <Ionicons
                name={showNew ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View
            style={{
              marginBottom: 30,
              position: "relative",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Confirm New Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              style={{
                backgroundColor: "#f8f8f8",
                borderRadius: 12,
                padding: 14,
                paddingRight: 40,
                borderWidth: 1,
                borderColor: "#ddd",
                fontSize: 16,
                color: "#333",
              }}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 10, top: 40 }}
              onPress={() => setShowConfirm(!showConfirm)}
            >
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            style={{
              backgroundColor: "#3D83F5",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "LatoBold",
              }}
            >
              Update Password
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
