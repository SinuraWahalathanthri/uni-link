import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your university email.");
      return;
    }

    try {
      const q = query(collection(db, "lecturers"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "Lecturer not found.");
        return;
      }

      const doc = querySnapshot.docs[0];
      const lecturerData = doc.data();

      // ✅ Add docId to the data
      const fullLecturerData = { ...lecturerData, docId: doc.id };

      if (lecturerData.password) {
        // Password-based login
        if (lecturerData.password === password) {
          Alert.alert("Success", "Login successful.");
          router.replace({
            pathname: "/(tabs)", // 👈 adjust this route as needed
            params: { lecturer: JSON.stringify(fullLecturerData) },
          });
        } else {
          Alert.alert("Error", "Incorrect password.");
        }
      } else {
        // OTP-based login
        router.push({
          pathname: "/otpScreen",
          params: {
            email: lecturerData.email,
            lecturerID: lecturerData.lecturer_id,
            expectedOTP: lecturerData.OTP,
          },
        });
      }
    } catch (err) {
      Alert.alert("Error", "Login failed. Try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>
            Login to <Text style={{ color: "#3D83F5" }}>UniLink</Text>
          </Text>
          <Text style={styles.subTitle}>
            Sign in to your university account
          </Text>

          <Image
            source={require("../../assets/images/student.png")}
            style={styles.image}
          />

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>University Email or Student ID</Text>
            <View
              style={[
                styles.emailInputWrapper,
                emailFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={"#777777"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                passwordFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={"#777777"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                secureTextEntry
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Login Button */}
          <View style={styles.loginSection}>
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => console.log("Forgot Password")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by XZORA Devlabs</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 40,
    fontFamily: "LatoBlack",
    fontSize: 24,
    lineHeight: 29,
  },
  subTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#1C1E24",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginTop: 50,
  },
  inputContainer: {
    marginTop: 24,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 20,
    color: "#505050",
  },
  emailInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  passwordContainer: {
    marginTop: 15,
  },
  passwordInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  loginSection: {
    marginTop: 45,
  },
  loginButton: {
    backgroundColor: "#3D83F5",
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  loginButtonText: {
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "white",
  },
  forgotText: {
    fontFamily: "LatoBold",
    fontSize: 14,
    lineHeight: 20,
    color: "#3D83F5",
    textAlign: "center",
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontFamily: "LatoBold",
    fontSize: 14,
    lineHeight: 20,
    color: "#D0D0D0",
    textAlign: "center",
    marginBottom: 18,
  },
  focusedInput: {
    borderColor: "#3D83F5",
    borderWidth: 2,
  },
});
