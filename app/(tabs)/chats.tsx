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
  View,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import CommonStyles from "@/constants/CommonStyles";
import AppHeader from "@/components/main/Header";
import { useNavigation } from "expo-router";

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

export default function ChatScreen() {
  const [emailFocused, setEmailFocused] = useState(false);
  const navigation = useNavigation();

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
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.searchInputWrapper,
                emailFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={"#777777"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Search staff by name, department, or designation"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={lectureData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#e5e5e5" }} />
            )}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
              marginTop: 16,
            }}
            renderItem={({ item }) => (
              <ChatCard onPress={navigateToChat} item={item} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 20,
    color: "#505050",
  },
  searchInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#f3f4f6",
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  focusedInput: {
    borderColor: "#3D83F5",
    borderWidth: 1,
  },
});
