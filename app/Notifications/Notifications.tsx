import AppHeader from "@/components/main/Header";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/FirebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ExpoNotifications from "expo-notifications";
import * as Device from "expo-device";

const ICONS = {
  event: { name: "event", color: "#10B981" },
  community: { name: "groups", color: "#3D83F5" },
  message: { name: "email", color: "#F59E0B" },
  announcement: { name: "campaign", color: "#EF4444" },
  consultations: { name: "event-note", color: "#10B981" },
  default: { name: "notifications", color: "#6B7280" },
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = timestamp.toDate();
  const diff = now - date;

  const mins = Math.floor(diff / (1000 * 60));
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const { name, color } = ICONS[notification.related_type] || ICONS.default;

  return (
    <Pressable
      style={[
        styles.notificationItem,
        !notification.is_read && styles.unreadBackground,
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <MaterialIcons name={name} size={20} color="#fff" />
        </View>

        <View style={styles.notificationDetails}>
          <Text
            style={[
              styles.notificationText,
              !notification.is_read && styles.unreadText,
            ]}
            numberOfLines={4}
          >
            {notification.message_description}
          </Text>
          <Text
            style={[
              styles.notificationText,
              !notification.is_read && styles.unreadText,
              { fontFamily: "Lato", color: "grey", fontSize: 14 },
            ]}
            numberOfLines={4}
          >
            {notification.message_text}
          </Text>
          <View style={styles.notificationMeta}>
            <Text style={styles.notificationType}>
              {notification.related_type.charAt(0).toUpperCase() +
                notification.related_type.slice(1)}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTime(notification.timestamp)}
            </Text>
          </View>
        </View>
        {!notification.is_read && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.notificationActions}>
        {!notification.is_read && (
          <Pressable
            style={styles.actionButton}
            onPress={() => onMarkAsRead(notification)}
          >
            <MaterialIcons name="done" size={20} color="#10B981" />
          </Pressable>
        )}
        <Pressable
          style={styles.actionButton}
          onPress={() => onDelete(notification)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const Notifications = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("student_id", "==", user.id),
      where("receiver_type", "==", "student"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (data.length > prevCount) {
        const newItem = data[0];
        if (newItem && !newItem.is_read) {
          showLocalPushNotification(newItem.message_text);
        }
      }

      setPrevCount(data.length);
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [prevCount]);

  const showLocalPushNotification = async (message) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: "📢 New Notification",
        body: message,
        sound: true,
      },
      trigger: null,
    });
  };

  const markAsRead = async (notification) => {
    try {
      await updateDoc(doc(db, "notifications", notification.id), {
        is_read: true,
      });
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item
        )
      );
    } catch {
      Alert.alert("Error", "Failed to mark as read");
    }
  };

  const deleteNotification = (notification) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "notifications", notification.id));
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            );
          } catch {
            Alert.alert("Error", "Failed to delete notification");
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <AppHeader />
        </View>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="notifications-none" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You don't have any notifications yet.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  unreadBackground: {
    backgroundColor: "#E8F2FF",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  activeFilterTab: {
    backgroundColor: "#3D83F5",
  },
  filterTabText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#6D6D6E",
  },
  activeFilterTabText: {
    fontFamily: "LatoBold",
    color: "#fff",
  },
  filterBadge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  activeFilterBadge: {
    backgroundColor: "#fff",
  },
  filterBadgeText: {
    fontFamily: "LatoBold",
    fontSize: 10,
    color: "#6D6D6E",
  },
  activeFilterBadgeText: {
    color: "#3D83F5",
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#fff",
  },
  unreadNotification: {
    backgroundColor: "#F8FAFC",
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDetails: {
    flex: 1,
  },
  notificationText: {
    fontFamily: "Lato",
    fontSize: 16,
    color: "#374151",
    lineHeight: 20,
  },
  unreadText: {
    fontFamily: "LatoBold",
    color: "#000",
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  notificationType: {
    fontFamily: "LatoBold",
    fontSize: 11,
    color: "#3D83F5",
    textTransform: "uppercase",
  },
  notificationTime: {
    fontFamily: "Lato",
    fontSize: 11,
    color: "#9CA3AF",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3D83F5",
    marginLeft: 8,
  },
  notificationActions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Notifications;
