import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";

const AnnouncementCard = ({ item }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#FF4D4D";
      case "medium":
        return "#FFA500";
      case "low":
        return "#4CAF50";
      default:
        return "#875F26";
    }
  };

  return (
    <View style={[styles.card, styles.announcementCard]}>
      <Text
        style={[styles.dateText, { color: getPriorityColor(item.priority) }]}
      >
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        {" • "}
        {item.priority}
      </Text>

      <Text style={styles.cardTitle}>{item.title}</Text>

      <Text style={styles.content}>{item.content}</Text>
    </View>
  );
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      where("type", "==", "Announcements"),
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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Latest Announcements</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3D83F5"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 80 : 40,
          }}
          renderItem={({ item }) => <AnnouncementCard item={item} />}
        />
      )}
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  headerTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#000",
  },
  announcementCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3D83F5",
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    borderRadius: 12,
    marginTop: 13,
  },
  dateText: {
    fontFamily: "LatoBold",
    fontSize: 12,
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
    color: "#333",
  },
});
