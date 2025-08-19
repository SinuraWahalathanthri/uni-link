import { Image } from "expo-image";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import AppHeader from "@/components/main/Header";

const EventCard = ({ item }) => (
  <Pressable style={styles.card}>
    <Image source={item.image} style={styles.upcomingImage} />
    <Pressable style={styles.overlay} />
    <Pressable style={styles.heart}>
      <MaterialCommunityIcons name="heart" color="#ffffff" size={16} />
    </Pressable>
    <View style={styles.textContainer}>
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.titleText}>{item.title}</Text>
    </View>
  </Pressable>
);

export default function LectureHome() {
  const { lecturer } = useLocalSearchParams();
  const [lecturerData, setLecturerData] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (lecturer) {
      setLecturerData(JSON.parse(lecturer));
    }

    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          eventList.push({
            id: doc.id,
            title: data.title,
            date: formatDate(data.start_time.toDate()),
            image: require("../assets/images/hackthonImage.png"),
          });
        });

        setEvents(eventList);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateObj) => {
    const options = { weekday: "short", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  };

  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        if (!lecturer) return;

        const lectureDoc = JSON.parse(lecturer);
        console.log("Lecture doc from params:", lectureDoc);

        const lectureDocId = lectureDoc.docId || lectureDoc.lecturer_id; // fallback if docId missing

        if (!lectureDocId) {
          console.error("❌ No valid lecturer ID found.");
          return;
        }

        const q = query(
          collection(db, "consultations"),
          where("lecturer_id", "==", lectureDocId),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const snapshot = await getDocs(q);
        const recentConsultations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConsultations(recentConsultations);
      } catch (error) {
        console.error("🔥 Error fetching consultations:", error);
      }
    };

    fetchConsultations();
  }, [lecturer]);

  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""}`;
      }
    }
    return "just now";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Blue Header Section */}
      <View style={styles.blueHeaderSection}>
        <View
          style={[
            styles.headerContainer,
            { paddingTop: Platform.OS === "ios" ? 0 : 36 },
          ]}
        >
          <AppHeader type="lecture" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {lecturerData
                ? `Good Evening, ${lecturerData.name}`
                : "Good Evening!"}
            </Text>
            <Text style={styles.headerSubTitle}>
              Every day is a new beginning.
            </Text>
          </View>
        </View>
      </View>

      {/* White Content Section */}
      <View style={styles.whiteContentSection}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Upcoming Events */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>
          <View style={styles.eventsContainer}>
            <FlatList
              data={events}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <EventCard item={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 1 }}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            />
          </View>

          {/* Quick Access */}
          <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
          </View>
          <View style={styles.quickAccessContainer}>
            <View style={styles.quickAccessRow}>
              <Pressable style={styles.quickAccessCard}>
                <View style={styles.quickAccessTop}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#3D83F5" },
                    ]}
                  >
                    <MaterialIcons
                      name="chat-bubble-outline"
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                </View>
                <Text style={styles.quickAccessText}>Chat with Students</Text>
              </Pressable>

              <Pressable style={styles.quickAccessCard}>
                <View style={styles.quickAccessTop}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#20C660" },
                    ]}
                  >
                    <MaterialIcons
                      name="people-alt"
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>5</Text>
                  </View>
                </View>
                <Text style={styles.quickAccessText}>
                  Pending Consultations
                </Text>
              </Pressable>
            </View>

            <View style={styles.quickAccessRow}>
              <Pressable style={styles.quickAccessCard}>
                <View style={styles.quickAccessTop}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#F87216" },
                    ]}
                  >
                    <MaterialIcons
                      name="info-outline"
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                </View>
                <Text style={styles.quickAccessText}>Get Help</Text>
              </Pressable>

              <Link href="/resources" asChild>
                <Pressable style={styles.quickAccessCard}>
                  <View style={styles.quickAccessTop}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: "#A357FF" },
                      ]}
                    >
                      <MaterialIcons
                        name="menu-book"
                        size={20}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                  <Text style={styles.quickAccessText}>Upload Resources</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {/* Recent Consultation Requests */}
          <View style={styles.consultationHeader}>
            <Text style={styles.consultationTitle}>
              Recent Consultation Requests
            </Text>
            <Link
              href={{
                pathname: "/(app)/ConsultationRequest",
                params: { lecturerData: JSON.stringify(lecturerData) },
              }}
              asChild
            >
              <Pressable>
                <Text style={styles.viewAllText}>View all</Text>
              </Pressable>
            </Link>
          </View>
          <View style={styles.consultationContainer}>
            {consultations.length === 0 ? (
              <Text style={{ color: "#6b7280" }}>
                No recent consultations found.
              </Text>
            ) : (
              consultations.map((item) => (
                <View key={item.id} style={styles.consultationCard}>
                  <View style={styles.consultationTop}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <MaterialIcons
                        name="info-outline"
                        size={20}
                        color="#f59e0b"
                      />
                      <View>
                        <Text style={styles.consultationName}>
                          {item.topic || "No Topic"}
                        </Text>
                        <Text style={styles.consultationTopic}>
                          {item.student_id || "Student ID not available"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.consultationTime}>
                      {timeSince(item.createdAt?.toDate?.() || new Date())} ago
                    </Text>
                  </View>
                  <Text style={styles.consultationTitleText}>
                    {item.topic || "Untitled"}
                  </Text>
                  <Text style={styles.consultationDesc}>
                    {item.description || "No description provided."}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F4996", // Blue background for safe area
  },

  // Blue Header Section
  blueHeaderSection: {
    backgroundColor: "#0F4996", // Blue background
    paddingBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  headerTextContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "LatoBold",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSubTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#B3C6E7",
  },

  // White Content Section
  whiteContentSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12, // Slight overlap for smooth transition
    paddingTop: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 80 : 40,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    lineHeight: 20,
    color: "#000000",
  },
  viewAllText: {
    fontFamily: "Lato",
    fontSize: 15,
    lineHeight: 19,
    color: "#1A3C7C",
  },

  // Events
  eventsContainer: {
    marginBottom: 8,
  },

  // Quick Access
  quickAccessContainer: {
    marginTop: 8,
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  quickAccessCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#CFCFCF",
  },
  quickAccessTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    marginTop: 10,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 100,
    backgroundColor: "#EF4444",
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontFamily: "Lato",
    fontSize: 12,
    lineHeight: 15,
    color: "white",
  },
  quickAccessText: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 19,
    color: "#000000",
    marginTop: 5,
  },

  // Consultation
  consultationContainer: {
    marginTop: 16,
    gap:10
  },

  // Event Card Styles (unchanged)
  card: {
    width: 200,
    height: 246,
    borderRadius: 16,
    overflow: "hidden",
  },
  upcomingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000050",
    borderRadius: 16,
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF70",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    bottom: 20,
    left: 12,
  },
  dateText: {
    fontFamily: "Lato",
    color: "#C9C9C9",
    fontSize: 16,
    lineHeight: 19,
  },
  titleText: {
    fontFamily: "Lato",
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 19,
    marginTop: 5,
  },

  // Lecture Card Styles (unchanged)
  lectureCard: {
    width: 195,
    height: 198,
    borderRadius: 16,
    overflow: "hidden",
  },
  lectureImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  lectureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000050",
    borderRadius: 16,
  },
  lectureTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 12,
  },
  lectureNameText: {
    fontFamily: "Lato",
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
  },
  lectureTitleText: {
    fontFamily: "Lato",
    color: "#EFEFEF",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 5,
  },

  consultationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    alignItems: "center",
  },
  consultationTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#000000",
  },
  consultationCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    borderRadius: 12,
  },
  consultationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  consultationName: {
    marginLeft: 8,
    fontFamily: "LatoBold",
    fontSize: 16,
    color: "#000000",
  },
  consultationTopic: {
    marginLeft: 8,
    fontFamily: "LatoBold",
    fontSize: 14,
    color: "#1A1C87",
  },
  consultationTime: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#1A1C87",
  },
  consultationTitleText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    color: "#1e40af",
    marginTop: 5,
  },
  consultationDesc: {
    fontFamily: "Lato",
    color: "#475569",
    marginTop: 2,
  },
});
