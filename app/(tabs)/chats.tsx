import { Image } from "expo-image";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import CommonStyles from "@/constants/CommonStyles";
import AppHeader from "@/components/main/Header";
import { Link, useNavigation } from "expo-router";

const lectureData = [
  {
    id: "1",
    name: "University Exam Schedule Released",
    user_type: "Exam",
    Department: "1 day ago",
    msg: "4 min read",
    timeAgo: "1 day ago",
    unreadCount: 2,
    readTime: "4 min read",
    image: require("../../assets/images/hackthonImage.png"),
  },
  {
    id: "2",
    name: "University Exam Schedule Released",
    user_type: "Exam",
    Department: "1 day ago",
    msg: "4 min read",
    timeAgo: "1 day ago",
    unreadCount: 0,
    readTime: "4 min read",
    image: require("../../assets/images/hackthonImage.png"),
  },
  {
    id: "3",
    name: "University Exam Schedule Released",
    user_type: "Exam",
    Department: "1 day ago",
    msg: "4 min read",
    timeAgo: "1 day ago",
    unreadCount: 0,
    readTime: "4 min read",
    image: require("../../assets/images/hackthonImage.png"),
  },
];

const ChatCard = ({ item, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <View style={styles.row}>
        <Image source={item.image} style={styles.profileImage} />
        <View style={styles.dot2} />
      </View>
      <View style={styles.content}>
        {/* Title */}
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.cardTitle}>Dr.Sarah Johnsons</Text>
          <Text
            style={[
              styles.metaTextLight,
              { marginTop: 5, alignContent: "flex-end", fontSize: 12 },
            ]}
          >
            4:15 PM
          </Text>
        </View>

        {/* Meta Row */}
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.metaRow}>
            <Text style={styles.tag}>Lecturer</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>Computer Science</Text>
          </View>

          {item.unreadCount > 0 && (
            <View style={{ marginTop: 6, marginRight: 4 }}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>2</Text>
              </View>
            </View>
          )}
        </View>

        <Text numberOfLines={2} style={styles.metaTextLight}>
          Your assignment submission is good, still needs more work to do putha.
          Dw we can do this together. you got this!!
        </Text>
      </View>
    </View>
  </Pressable>
);

const ConnectedCard = ({ item, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <View style={styles.row}>
        <Image source={item.image} style={styles.profileImage} />
        <View style={styles.dot2} />
      </View>
      <View style={styles.content}>
        {/* Title */}
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.cardTitle}>Dr.Sarah Johnsons</Text>
          <Text
            style={[
              styles.metaTextLight,
              { marginTop: 5, alignContent: "flex-end", fontSize: 12 },
            ]}
          >
            4:15 PM
          </Text>
        </View>

        {/* Meta Row */}
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.metaRow}>
            <Text style={styles.tag}>Lecturer</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>Computer Science</Text>
          </View>

          {item.unreadCount > 0 && (
            <View style={{ marginTop: 6, marginRight: 4 }}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>2</Text>
              </View>
            </View>
          )}
        </View>

        <Text numberOfLines={2} style={styles.metaTextLight}>
          Your assignment submission is good, still needs more work to do putha.
          Dw we can do this together. you got this!!
        </Text>
      </View>
    </View>
  </Pressable>
);

const DiscoverCard = ({ item, onPress }) => (
  <View
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#D7D7D7",
          borderRadius: 12,
          marginTop: 13,
          backgroundColor: "#fff",
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "row", gap: 12, flex: 1, width: "100%" }}>
          <View style={{ borderRadius: 12, marginBottom: 10 }}>
            <Image
              source={require("../../assets/images/lectureImage.png")}
              style={{ width: 91, height: 91, borderRadius: 12 }}
              contentFit="cover"
            />
            <View
              style={{
                width: 13,
                height: 13,
                backgroundColor: "#48D562",
                position: "absolute",
                bottom: 8,
                right: -2,  
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            ></View>
          </View>
  
          <View style={{ marginBottom: 8, gap: 4, flex: 1 }}>
            <Text style={{ fontFamily: "LatoBold", fontSize: 16, color: "#000" }}>
              Prof. Tharaka Prasanna
            </Text>
            <View
              style={{
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "LatoBold",
                  fontSize: 14,
                  color: "#3D83F5",
                  lineHeight: 20,
                }}
              >
                Senior Lecturer
              </Text>
  
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    color: "#919191",
                    lineHeight: 20,
                  }}
                >
                  Computer Science
                </Text>
              </View>
            </View>
  
            <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
              <ScrollView
                horizontal
                contentContainerStyle={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    paddingVertical: 1,
                    paddingHorizontal: 18,
                    backgroundColor: "#DBEAFE",
                    borderRadius: 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "LatoBold",
                      fontSize: 13,
                      lineHeight: 28,
                      color: "#2A4BB4",
                    }}
                  >
                    Machine Learning
                  </Text>
                </View>
                <View
                  style={{
                    paddingVertical: 1,
                    paddingHorizontal: 18,
                    backgroundColor: "#DBEAFE",
                    borderRadius: 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "LatoBold",
                      fontSize: 13,
                      lineHeight: 28,
                      color: "#2A4BB4",
                    }}
                  >
                    Database System
                  </Text>
                </View>
                <View
                  style={{
                    paddingVertical: 1,
                    paddingHorizontal: 18,
                    backgroundColor: "#f3f4f6",
                    borderRadius: 100,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "LatoBold",
                      fontSize: 11,
                      lineHeight: 28,
                      color: "#5D6673",
                    }}
                  >
                    +1 more
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Link href={"/eventsDetails"} asChild>
            <Pressable
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: "#3D83F5",
                borderRadius: 100,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <MaterialIcons name="chat-bubble-outline" size={20} color="#ffffff" />
              <Text
                style={{ fontFamily: "LatoBold", fontSize: 14, color: "#fff" }}
              >
                Start Chat
              </Text>
            </Pressable>
          </Link>
          <Pressable
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: "#E6E5E7",
              borderRadius: 100,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontFamily: "LatoBold", fontSize: 14 }}>
              View Profile
            </Text>
          </Pressable>
        </View>
      </View>
);

const myGroupsData = [
  {
    id: "1",
    name: "AI Club",
    image: require("../../assets/images/hackthonImage.png"),
  },
  {
    id: "2",
    name: "Music Society",
    image: require("../../assets/images/hackthonImage.png"),
  },
];

const discoverGroupsData = [
  {
    id: "3",
    name: "Photography Club",
    image: require("../../assets/images/hackthonImage.png"),
  },
  {
    id: "4",
    name: "Game Dev Circle",
    image: require("../../assets/images/hackthonImage.png"),
  },
];

export default function ChatScreen() {
  const [emailFocused, setEmailFocused] = useState(false);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"connected" | "discover">(
    "connected"
  );

  const selectedData =
    activeTab === "connected" ? myGroupsData : discoverGroupsData;
  const renderCard = activeTab === "connected" ? ConnectedCard : DiscoverCard;

  const navigateToChat = () => {
    navigation.navigate("Chat/ChatScreen");
  };

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
        <View>
          {/* Title and subtitle */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.title}>Connect with Lecturers</Text>
              <Text style={styles.subTitle}>
                Chat and connect with your lecturers here
              </Text>
            </View>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: "#3D83F5",
                borderRadius: 4,
              }}
            >
              <MaterialIcons name="add" color={"#ffffff"} size={24} />
            </View>
          </View>

          <View style={{ marginTop: 16 }} />

          <View style={styles.container2}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "connected" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("connected")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "connected" && styles.activeTabText,
                ]}
              >
                Connected Lecturers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "discover" && styles.activeTab]}
              onPress={() => setActiveTab("discover")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "discover" && styles.activeTabText,
                ]}
              >
                Discover Lecturers
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: -16 }} />
          <View style={CommonStyles.inputContainer}>
            <View
              style={[
                CommonStyles.emailInputWrapper,
                emailFocused && CommonStyles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={"#777777"}
              />
              <TextInput
                style={CommonStyles.textInput}
                placeholder="Search lecturers and staff"
                placeholderTextColor={"#777777"}
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {/* <FlatList
            data={lectureData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) => (
              <ChatCard onPress={navigateToChat} item={item} />
            )}
          /> */}

          <FlatList
            data={selectedData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
              
            }}
            renderItem={({ item }) =>
              React.createElement(renderCard, { item, onPress: navigateToChat })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    // backgroundColor: "#3D83F5",
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

  //
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
    padding: 10,
    marginTop: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 2,
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
    marginTop: -4,
    marginBottom: 5,
  },
  tag: {
    color: "#BF272E",
    fontFamily: "LatoBold",
    fontSize: 14,
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
    marginTop: 4,
  },
  dot: {
    marginHorizontal: 6,
    color: "#6B6B6B",
    fontSize: 20,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontFamily: "LatoBold",
    color: "#3A3A3A",
    fontSize: 13,
  },

  ////////////
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    alignSelf: "center",
    borderRadius: 100,
  },
  subTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#6B6B6B",
  },
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 20,
    color: "#505050",
  },
  emailInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    paddingVertical: 0,
    flex: 1,
    color: "#000000",
  },
  focusedInput: {
    borderColor: "#3D83F5",
    borderWidth: 1,
  },
});
