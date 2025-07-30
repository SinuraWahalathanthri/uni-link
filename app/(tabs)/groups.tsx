import { Image } from "expo-image";
import {
  FlatList,
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
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import CommonStyles from "@/constants/CommonStyles";
import AppHeader from "@/components/main/Header";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getUserCommunities } from "@/services/StorageServices";

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

const GroupCard = ({ item, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <View style={styles.row}>
        <Image source={item.image} style={styles.profileImage} />
        <View style={styles.dot2} />
      </View>
      <View style={styles.content}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.cardTitle}>
           {item.name}
          </Text>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          {item.unreadCount > 0 && (
            <View style={{ marginTop: 6, marginRight: 4 }}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>2</Text>
              </View>
            </View>
          )}
        </View>

        <Text
          numberOfLines={2}
          style={[styles.metaTextLight, { marginTop: -4 }]}
        >
          {item.description}
        </Text>

        <View style={styles.row}>
          <View style={styles.metaRow}>
            <Feather name="users" size={14} color={"#777777"} />
            <Text style={styles.tag}>  {item.member_count || (item.members?.length || 0)} members</Text>
          </View>
          <View style={[styles.metaRow, { marginLeft: 10 }]}>
            <Feather name="message-circle" size={14} color={"#777777"} />
            <Text style={styles.tag}>5 mins ago</Text>
          </View>
        </View>
      </View>
    </View>
  </Pressable>
);

const DiscoverCard = ({ item, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <View style={styles.row}>
        <Image source={item.image} style={styles.profileImage} />
        <View style={styles.dot2} />
      </View>
      <View style={styles.content}>
        {/* Title */}
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.cardTitle}>
            Software Design and Analysis Lecture
          </Text>
        </View>

        <View style={[styles.row, { justifyContent: "space-between" }]}></View>

        <Text
          numberOfLines={2}
          style={[styles.metaTextLight, { marginTop: -4 }]}
        >
          Official channel for Software Design and Analysis Exam Preparation{" "}
          {"\n"}( Resources and Notes )
        </Text>

        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.metaRow}>
            <Feather name="users" size={14} color={"#777777"} />
            <Text style={styles.tag}>245 members</Text>
          </View>
          <TouchableOpacity style={styles.joinButton} onPress={onPress}>
            <Feather name="user-plus" size={14} color={"#fafafa"} />
            <Text style={styles.tagWhite}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Pressable>
);



export default function GroupsScreen() {
  const [emailFocused, setEmailFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<"myGroups" | "discover">(
    "myGroups"
  );
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const navigation = useNavigation();

  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [discoverGroups, setDiscoverGroups] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunities = async () => {
    setRefreshing(true);
    const userGroups = await getUserCommunities(user.id);
    setMyGroups(userGroups);

    const allCommunities = await getUserCommunities(null);
    const nonMemberGroups = allCommunities.filter(
      (c: any) => !c.members.some((m: any) => m.id === user?.id)
    );
    setDiscoverGroups(nonMemberGroups);

    setRefreshing(false);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const navigateToChat = (community: any) => {
    navigation.navigate("Groups/GroupDetails", { communityId: community.id });
  };

  const filteredData = (
    activeTab === "myGroups" ? myGroups : discoverGroups
  ).filter(
    (group) =>
      group.name.toLowerCase().includes(searchText.toLowerCase()) ||
      group.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <AppHeader />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.title}>Groups</Text>
            <Text style={styles.subTitle}>
              Connect with university communities
            </Text>
          </View>

          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              backgroundColor: "#3D83F5",
              borderRadius: 4,
            }}
          >
            <MaterialIcons name="add" color={"#ffffff"} size={24} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16 }} />
        <View style={styles.container2}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "myGroups" && styles.activeTab]}
            onPress={() => setActiveTab("myGroups")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "myGroups" && styles.activeTabText,
              ]}
            >
              My Groups
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
              Discover Groups
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
            <MaterialCommunityIcons name="magnify" size={20} color={"#777"} />
            <TextInput
              style={CommonStyles.textInput}
              placeholder="Search groups and communities"
              placeholderTextColor="#777"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchCommunities}
              />
            }
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) =>
              activeTab === "myGroups" ? (
                <GroupCard item={item} onPress={() => navigateToChat(item)} />
              ) : (
                <DiscoverCard
                  item={item}
                  onPress={() => navigateToChat(item)}
                />
              )
            }
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 20 }}
              >
                No groups found
              </Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    padding: 14,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
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
