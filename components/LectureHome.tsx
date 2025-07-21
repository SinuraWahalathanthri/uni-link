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
import AppHeader from "@/components/main/Header";
import AppointmentCard from "@/components/main/AppointmentCard";
import { Link } from "expo-router";

const eventData = [
  {
    id: "1",
    date: "Sat, April 22",
    title: "Hacktivate 2000",
    image: require("../assets/images/hackthonImage.png"),
  },
  {
    id: "2",
    date: "Sun, May 14",
    title: "CodeX Summit",
    image: require("../assets/images/hackthonImage.png"),
  },
];

const lectureData = [
  {
    id: "1",
    lecutureName: "Prof. Ajith Fernando",
    title: "Senior Lecture",
    image: require("../assets/images/lectureImage.png"),
  },
  {
    id: "2",
    lecutureName: "Prof. Ajith Fernando",
    title: "Senior Lecture",
    image: require("../assets/images/lectureImage.png"),
  },
];

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

const LectureCard = ({ item }) => (
  <Pressable style={styles.lectureCard}>
    <Image source={item.image} style={styles.lectureImage} />
    <Pressable style={styles.lectureOverlay} />
    <View style={styles.lectureTextContainer}>
      <Text style={styles.lectureNameText}>{item.lecutureName}</Text>
      <Text style={styles.lectureTitleText}>{item.title}</Text>
    </View>
  </Pressable>
);

export default function LectureHome() {
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
          <AppHeader type={"lecture"} />

          {/* Title and subtitle in blue section */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Good Evening, Dr.Kamal!</Text>
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
              data={eventData}
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
            {/* Row 1 */}
            <View style={styles.quickAccessRow}>
              {/* Chat with Students */}
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

              {/* Pending Consultations */}
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

            {/* Row 2 */}
            <View style={styles.quickAccessRow}>
              {/* Get Help */}
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

              {/* Upload Resources */}
              <Link href={"/resources"} asChild>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "LatoBold",
                fontSize: 18,
                lineHeight: 20,
                color: "#000000",
              }}
            >
              Recent Consultation Requests
            </Text>
            <Link href={"/consultationRequest"} asChild>
              <Pressable>
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 15,
                    lineHeight: 19,
                    color: "#1A3C7C",
                  }}
                >
                  View all
                </Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.consultationContainer}>
            <View
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#D7D7D7",
                borderRadius: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    name="info-outline"
                    size={20}
                    color="#f59e0b"
                  />
                  <View>
                    <Text
                      style={{
                        marginLeft: 8,
                        fontFamily: "LatoBold",
                        fontSize: 16,
                        lineHeight: 19,
                        color: "#000000",
                      }}
                    >
                      Emily Perera (STU00902)
                    </Text>
                    <Text
                      style={{
                        marginLeft: 8,
                        fontFamily: "LatoBold",
                        fontSize: 14,
                        lineHeight: 19,
                        color: "#1A1C87",
                      }}
                    >
                      Final Project Discussion
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ fontFamily: "Lato", fontSize: 14, color: "#1A1C87" }}
                >
                  5 hours
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "LatoBold",
                  fontSize: 16,
                  color: "#1e40af",
                  marginTop: 5,
                }}
              >
                Final Project Discussion
              </Text>
              <Text
                style={{ fontFamily: "Lato", color: "#475569", marginTop: 2 }}
              >
                Would like to discuss my final project?
              </Text>
            </View>
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
});
