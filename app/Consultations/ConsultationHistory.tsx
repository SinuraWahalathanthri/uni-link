import { Image } from "expo-image";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Stack, useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  getLecturer,
  getUserCommunities,
  getYourConsultations,
} from "@/services/StorageServices";
import { format } from "date-fns";
import ConsultationCard from "./Card";
import AppointmentCard from "@/components/main/AppointmentCard";

type TabType = "accepted" | "pending" | "ended";

export default function ConsultationHistory() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [consultations, setConsultations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();

  const fetchConsultations = async () => {
    if (!user?.id) return;
    try {
      const data = await getYourConsultations(user.id);

      const withLecturers = await Promise.all(
        data.map(async (c) => {
          try {
            const lecturer = await getLecturer(c.lecturer_id);
            return { ...c, lecturer };
          } catch {
            return { ...c, lecturer: null };
          }
        })
      );

      setConsultations(withLecturers);
    } catch (error) {
      console.error("Error loading consultations:", error);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  console.log(
    "Pending consultations:",
    consultations.filter((c) => c.status === "pending")
  );

  const filteredConsultations = consultations
    .filter((c) => {
      if (activeTab === "accepted") {
        return c.status === "accepted" || c.status === "meeting-started";
      }
      return c.status === activeTab;
    })
    .sort((a, b) => {
      const dateA = a.scheduledDateTime?.toDate?.() || new Date(0);
      const dateB = b.scheduledDateTime?.toDate?.() || new Date(0);

      return dateA.getTime() - dateB.getTime();
    });

  const onRefresh = async () => {
    await fetchConsultations();
    setRefreshing(true);

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View style={{ width: 24 }} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <View>
          <Text style={styles.title}>Consultation History</Text>
          <Text style={styles.subTitle}>
            Booking history of consultations and physical meets
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }} />

      {/* Tabs */}
      <View style={styles.container2}>
        {(["accepted", "pending", "ended"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredConsultations}
        keyExtractor={(item) =>
          item.id ||
          item.createdAt?.toDate?.().toISOString() ||
          Math.random().toString()
        }
        style={{marginTop:-16}}
        renderItem={({ item }) => <AppointmentCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <>
            <View>
              <Ionicons
                name="calendar-outline"
                style={{
                  fontSize: 100,
                  textAlign: "center",
                  color: "#e9e9e9ff",
                }}
              />
              <Text
                style={{
                  padding: 20,
                  textAlign: "center",
                  color: "#c0bebeff",
                  fontSize: 20,
                  fontFamily: "LatoBold",
                }}
              >
                No consultations found - Scroll down to Refresh
              </Text>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 20, padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 74 : 30,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 20,
    fontFamily: "LatoBold",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#16a34a",
    color: "#fafafa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  container2: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#ffffffff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  activeTabText: {
    color: "#3D83F5",
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#3d83f5",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 16,
  },
  cardTitle: {
    fontFamily: "LatoBold",
    fontSize: 16,
    lineHeight: 29,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  image: {
    width: 148,
    height: 65,
    alignSelf: "center",
    marginTop: 14,
  },
  content: {
    marginLeft: 12,
    flex: 1,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 5,
  },
  tag: {
    color: "#6B6B6B",
    fontFamily: "Lato",
    fontSize: 14,
    marginLeft: 6,
  },
  tagWhite: {
    color: "#fafafa",
    fontFamily: "LatoBold",
    fontSize: 14,
    marginLeft: 6,
  },
  metaText: {
    color: "#6B6B6B",
    fontFamily: "LatoBold",
    fontSize: 14,
  },
  metaTextLight: {
    color: "#6B6B6B",
    fontFamily: "Lato",
    fontSize: 14,
  },
  dot2: {
    width: 10,
    height: 10,
    marginHorizontal: 6,
    backgroundColor: "#48d562",
    borderRadius: 10,
    position: "absolute",
    top: 50,
    bottom: 2,
    right: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 0,
  },
  profileImage: {
    width: 60,
    height: 60,
    alignSelf: "center",
    borderRadius: 100,
  },
});
