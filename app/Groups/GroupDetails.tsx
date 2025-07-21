import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";

export default function GroupDetailScreen() {
  const navigation = useNavigation();

  const navigateToChat = () => {
    navigation.navigate("Groups/GroupScreen");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            title: "",
            headerTitleStyle: { color: "#ffffff" },
            headerShadowVisible: false,
            headerTransparent: true,
            headerTintColor: "#ffffff",
          }}
        />
        <Image
          source={require("../../assets/images/main/cover.png")}
          style={styles.bannerImage}
        />
        <Image
          source={require("../../assets/images/main/group-img.png")}
          style={styles.groupIcon}
        />

        <Text style={styles.title}>Software Design and Analysis Lecture</Text>

        <View style={styles.communityRow}>
          <View style={styles.profileStack}>
            {[...Array(5)].map((_, i) => (
              <Image
                key={i}
                source={require("../../assets/images/profileImage.png")}
                style={[styles.avatar, { marginLeft: i === 0 ? 0 : -10 }]}
              />
            ))}
          </View>
          <Text style={styles.communityText}>Community - 126 people</Text>
        </View>
        <View
          style={{ width: "100%", height: 1, backgroundColor: "#F4F4F4" }}
        />
        <Text style={styles.description}>
          Official channel for Software Design and Analysis Exam Preparation
          （Resources and Notes）
        </Text>
        <View
          style={{ width: "100%", height: 20, backgroundColor: "#F4F4F4" }}
        />
        <Text style={styles.sectionTitle}>Media</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaRow}
        >
          <Image
            source={require("../../assets/images/main/hack-1.png")}
            style={styles.mediaImage}
          />
          <Image
            source={require("../../assets/images/main/hack-2.png")}
            style={styles.mediaImage}
          />
          <Image
            source={require("../../assets/images/main/hack-3.png")}
            style={styles.mediaImage}
          />
          <Image
            source={require("../../assets/images/main/hack-4.png")}
            style={styles.mediaImage}
          />
        </ScrollView>

        <Text style={styles.sectionTitle}>Group Created By</Text>
        <View style={styles.creatorRow}>
          <Image
            source={require("../../assets/images/profileImage.png")}
            style={styles.creatorImage}
          />
          <View>
            <Text style={styles.creatorName}>Prof. Michael Chen</Text>
            <Text style={styles.creatorRole}>Lecturer • Mathematics</Text>
          </View>
        </View>
        <View
          style={{ width: "100%", height: 1, backgroundColor: "#F4F4F4" }}
        />
        <Text style={styles.sectionTitle}>Group Admins</Text>

        <View style={styles.creatorRow}>
          <Image
            source={require("../../assets/images/main/michael.png")}
            style={styles.creatorImage}
          />
          <View>
            <Text style={styles.creatorName}>Prof. Michael Chen</Text>
            <Text style={styles.creatorRole}>Lecturer • Mathematics</Text>
          </View>
        </View>
        <View style={styles.creatorRow}>
          <Image
            source={require("../../assets/images/main/emily.png")}
            style={styles.creatorImage}
          />
          <View>
            <Text style={styles.creatorName}>Prof. Emily Rodrigo</Text>
            <Text style={styles.creatorRole}>Lecturer • Mathematics</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 16, marginBottom: 20 }}>
        <TouchableOpacity style={styles.joinButton} onPress={navigateToChat}>
          <Ionicons name="person-add" size={20} color="white" />
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bannerImage: { width: "100%", height: 180 },
  groupIcon: {
    width: 90,
    height: 90,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: -45,
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  communityRow: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  profileStack: {
    flexDirection: "row",
    marginBottom: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#fff",
    borderWidth: 1,
  },
  communityText: {
    fontSize: 13,
    color: "#555",
  },
  description: {
    textAlign: "left",
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: "Lato",
    color: "black",
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  mediaRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorName: {
    fontSize: 15,
    fontWeight: "500",
  },
  creatorRole: {
    fontSize: 13,
    color: "#666",
  },
  joinButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
});
