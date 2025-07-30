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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  

  const handleChangePassword = () => {
    // TODO: Add password update logic
    console.log("Password changed!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            justifyContent: "center",
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              fontFamily: "LatoBold",
              color: "#3D83F5",
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            Change Password
          </Text>

          {/* Current Password */}
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
