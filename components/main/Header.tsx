import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

export default function AppHeader() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const navigateToProfile = () => navigation.navigate("Profile/Profile");
  const navigateToNotification = () => navigation.navigate("Notifications/Notifications");

  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "notifications"),
      where("user_id", "==", user.id),
      where("receiver_type", "==", "student"), 
      where("is_read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/instituteLogo.png")}
        style={styles.logo}
      />

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={navigateToNotification} style={styles.iconWrapper}>
          <MaterialCommunityIcons name="bell-outline" size={24} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={{
              uri:
                user?.profileImage ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  logo: {
    width: 148,
    height: 65,
    marginTop: 14,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  iconWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
