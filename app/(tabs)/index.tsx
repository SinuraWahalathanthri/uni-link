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

const eventData = [
  {
    id: "1",
    date: "Sat, April 22",
    title: "Hacktivate 2000",
    image: require("../../assets/images/hackthonImage.png"),
  },
  {
    id: "2",
    date: "Sun, May 14",
    title: "CodeX Summit",
    image: require("../../assets/images/hackthonImage.png"),
  },
];

const lectureData = [
  {
    id: "1",
    lecutureName: "Prof. Ajith Fernando",
    title: "Senior Lecture",
    image: require("../../assets/images/lectureImage.png"),
  },
  {
    id: "2",
    lecutureName: "Prof. Ajith Fernando",
    title: "Senior Lecture",
    image: require("../../assets/images/lectureImage.png"),
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

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        {/* Header */}
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 80 : 40,
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Title and subtitle */}
            <View>
              <Text style={styles.title}>Hi there, Sinura!</Text>
              <Text style={styles.subTitle}>Every day is a new beginning.</Text>
            </View>

            {/* Upcomming Events */}
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
                Upcomming Events
              </Text>
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 15,
                  lineHeight: 19,
                  color: "#1A3C7C",
                }}
              >
                See all
              </Text>
            </View>

            <View style={{ marginTop: 16 }}>
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
                Upcomming Sessions
              </Text>
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 15,
                  lineHeight: 19,
                  color: "#1A3C7C",
                }}
              >
                See all
              </Text>
            </View>

            <View>
              <AppointmentCard />
            </View>

            {/* Quick Access */}
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
                Quick Access
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              {/* Row 1 */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                {/* Column 1 */}
                <Pressable
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: "#ffffff",
                    borderWidth: 1,
                    borderColor: "#CFCFCF",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#3D83F5",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        marginTop: 10,
                      }}
                    >
                      <MaterialIcons
                        name="chat-bubble-outline"
                        size={24}
                        color="#ffffff"
                      />
                    </View>

                    <View
                      style={{
                        paddingVertical: 1,
                        paddingHorizontal: 5,
                        borderRadius: 100,
                        backgroundColor: "red",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 12,
                          lineHeight: 15,
                          color: "white",
                        }}
                      >
                        1
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 14,
                      lineHeight: 19,
                      color: "#000000",
                      marginTop: 5,
                    }}
                  >
                    Chat with Lectures
                  </Text>
                </Pressable>

                {/* Column 2 */}
                <Pressable
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: "#ffffff",
                    borderWidth: 1,
                    borderColor: "#CFCFCF",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#20C660",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        marginTop: 10,
                      }}
                    >
                      <MaterialIcons
                        name="people-alt"
                        size={24}
                        color="#ffffff"
                      />
                    </View>

                    <View
                      style={{
                        paddingVertical: 1,
                        paddingHorizontal: 5,
                        borderRadius: 100,
                        backgroundColor: "red",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 12,
                          lineHeight: 15,
                          color: "white",
                        }}
                      >
                        5
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 14,
                      lineHeight: 19,
                      color: "#000000",
                      marginTop: 5,
                    }}
                  >
                    Join Event Groups
                  </Text>
                </Pressable>
              </View>

              {/* Row 2 */}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 12,
                  marginTop: 10,
                }}
              >
                {/* Column 1 */}
                <Pressable
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: "#ffffff",
                    borderWidth: 1,
                    borderColor: "#CFCFCF",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#F87216",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        marginTop: 10,
                      }}
                    >
                      <MaterialIcons
                        name="info-outline"
                        size={24}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 14,
                      lineHeight: 19,
                      color: "#000000",
                      marginTop: 5,
                    }}
                  >
                    Get Help
                  </Text>
                </Pressable>
                {/* Column 2 */}
                <Pressable
                  style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 16,
                    backgroundColor: "#ffffff",
                    borderWidth: 1,
                    borderColor: "#CFCFCF",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#A357FF",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        marginTop: 10,
                      }}
                    >
                      <MaterialIcons
                        name="menu-book"
                        size={24}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 14,
                      lineHeight: 19,
                      color: "#000000",
                      marginTop: 5,
                    }}
                  >
                    Resources
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Connect with lectures */}
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
                Connect with lectures
              </Text>
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
            </View>

            <View
              style={{
                marginTop: 16,
              }}
            >
              <FlatList
                data={lectureData}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <LectureCard item={item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 1 }}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              />
            </View>
          </View>
        </ScrollView>
      </View>
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

  // Event Card Styles
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

  // Lecuture Card Styles

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
