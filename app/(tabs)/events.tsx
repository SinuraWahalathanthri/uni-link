import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import AppHeader from "@/components/main/Header";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

const AnnouncementCard = ({ item }) => {
  const type = item.type?.toLowerCase();
  const isEvent = type === "events";

  return (
    <View style={[styles.card, !isEvent && styles.announcementCard]}>
      {isEvent && item.imageUrl && (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: 160 }}
            contentFit="cover"
          />
        </View>
      )}
      <Text style={styles.dateText}>
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        {" • "}
        {item.priority}
      </Text>

      <Text
        style={[
          styles.cardTitle,
          !isEvent && { fontSize: 18, color: "#1E1E1E", marginBottom: 8 },
        ]}
      >
        {item.title}
      </Text>

      <Text
        numberOfLines={isEvent ? 3 : undefined}
        style={[
          styles.content,
          !isEvent && {
            fontSize: 15,
            lineHeight: 22,
            color: "#333",
          },
        ]}
      >
        {item.content}
      </Text>
    </View>
  );
};

const Events = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = announcements.filter((item) => {
    const type = item.type?.toLowerCase();
    if (activeTab === "all") return true;
    if (activeTab === "events") return type === "events";
    if (activeTab === "announcements") return type === "announcements";
    return true;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <AppHeader />
        <Text style={styles.title}>Announcements</Text>
        <Text style={styles.subTitle}>
          Check the latest updates from your university
        </Text>

        {/* Tabs */}
        <View style={styles.container2}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "events" && styles.activeTab]}
            onPress={() => setActiveTab("events")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "events" && styles.activeTabText,
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "announcements" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("announcements")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "announcements" && styles.activeTabText,
              ]}
            >
              Announcements
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3D83F5"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) => <AnnouncementCard item={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  announcementCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3D83F5",
  },

  container2: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  activeTabText: {
    color: "#3D83F5",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
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
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    borderRadius: 20,
    marginTop: 13,
    backgroundColor: "#fff",
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  dateText: {
    fontFamily: "LatoBold",
    fontSize: 12,
    color: "#875F26",
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: "LatoBold",
    fontSize: 16,
    color: "#000",
    marginBottom: 6,
  },
  content: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#6B6B6B",
  },
});
