import { Image } from "expo-image";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AppHeader from "@/components/main/Header";
import AppointmentCard from "@/components/main/AppointmentCard";
import { Link, useNavigation } from "expo-router";
import Lecturers from "@/components/home/Lecturers";
import QuickAccess from "@/components/home/QuickAccess";
import Events from "@/components/home/Events";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "react-native-paper";
import { useEffect, useState } from "react";
import { getUniversity } from "@/services/StorageServices";

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [university, setUniversity] = useState(false);

  const handleLogout = () => {
    try {
      setUser(null);
      navigation.replace("(auth)");
    } catch (err) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const navigateToPassword = () => {
    navigation.navigate("Profile/ChangePassword");
  };

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const data = await getUniversity(user?.university_id);
        setUniversity(data);
      } catch (error) {
        console.error("Failed to fetch university:", error);
      }
    };

    fetchUniversity();
  }, [user?.university_id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 80 : 40,
          }}
        >
          <View
            style={{
              backgroundColor: "#3D83F5",
              borderRadius: 20,
              alignItems: "center",
              paddingVertical: 30,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Image
              source={{
                uri:
                  user?.profileImage ||
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: "#ffff",
                marginBottom: 15,
              }}
            />
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                fontFamily: "LatoBold",
                color: "#ffff",
              }}
            >
              {user?.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#ffff",
                fontFamily: "LatoBold",
                marginTop: 4,
              }}
            >
              {university?.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#ffff",
                fontFamily: "LatoBold",
                marginTop: 4,
              }}
            >
              {user?.degree}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                paddingHorizontal: 15,
                paddingVertical: 8,
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
            >
              {/* <MaterialIcons name="edit" size={18} color="#3D83F5" /> */}
              <Text
                style={{
                  color: "#3D83F5",
                  fontWeight: "600",
                  marginLeft: 6,
                  fontFamily: "LatoBold",
                  fontSize: 16,
                }}
              >
                {user?.institutional_id}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 20,
              marginBottom: 20,
              elevation: 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
                fontFamily: "LatoBold",
              }}
            >
              Student Information
            </Text>

            {[
              {
                icon: "user",
                label: "Student ID",
                value: user?.institutional_id,
              },
              { icon: "send", label: "Email", value: user?.email },
              {
                icon: "university",
                label: "University",
                value: university?.name,
              },
              { icon: "university", label: "Degree", value: user?.degree },
              { icon: "signal", label: "Department", value: user?.department },
              { icon: "mortar-board", label: "Batch", value: user?.batch },
              // { icon: "users", label: "Added By", value: user?.added_by },
              { icon: "check", label: "Status", value: user?.status },
              { icon: "calendar", label: "Year", value: user?.year },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <FontAwesome
                  name={item.icon as any}
                  size={20}
                  color="#3D83F5"
                  style={{ width: 25 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "LatoBold",
                      color: "#777",
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#333",
                      fontFamily: "LatoBold",
                      fontWeight: "500",
                    }}
                  >
                    {item.value || "N/A"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#3D83F5",
              borderRadius: 15,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              elevation: 1,
            }}
            onPress={navigateToPassword}
          >
            <Ionicons name="lock-closed-outline" size={22} color="#ffff" />
            <Text
              style={{
                marginLeft: 10,
                color: "#ffff",
                fontFamily: "LatoBold",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Change Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 16,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#3D83F5",
              alignItems: "center",
              justifyContent: "center",
              elevation: 1,
              marginTop: 16,
            }}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text
              style={{
                marginLeft: 10,
                color: "#3D83F5",
                fontFamily: "LatoBold",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              padding: 25,
              borderRadius: 20,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "LatoBold",
                textAlign: "center",
                marginBottom: 20,
                color: "#333",
              }}
            >
              Logout?
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontFamily: "Lato",
                textAlign: "center",
                color: "#666",
                marginBottom: 25,
              }}
            >
              Are you sure you want to log out of your account?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  backgroundColor: "#aaa",
                  borderRadius: 50,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  backgroundColor: "#E53935",
                  borderRadius: 50,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={handleLogout}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontFamily: "Lato" }}
                >
                  Yes, Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  image: {
    width: 148,
    height: 65,
    alignSelf: "center",
    marginTop: 14,
  },
  profileImage: {
    width: 40,
    height: 40,
    alignSelf: "center",
  },
  title: {
    fontFamily: "LatoBold",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "600",
  },
  subTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#6B6B6B",
  },
});
