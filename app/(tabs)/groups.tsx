import LetterComponent from "@/components/chat/LetterComponent";
import AppHeader from "@/components/main/Header";
import CommonStyles from "@/constants/CommonStyles";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/FirebaseConfig";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const GroupCard = ({ item, onPress, timeAgo }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <View style={styles.row}>
        <LetterComponent
          imageUrl={undefined}
          type={item.type}
          style={undefined}
        />
      </View>
      <View style={styles.content}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.cardTitle}>{item.name}</Text>
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
            <Text style={styles.tag}>
              {" "}
              {item.memberCount || item.members?.length || 0} members
            </Text>
          </View>
          <View style={[styles.metaRow, { marginLeft: 10 }]}>
            {item.hasUnread && (
              <>
                <Feather name="message-circle" size={14} color={"#777777"} />
                <Text style={styles.tag}>{timeAgo(item.latestMessage)}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  </Pressable>
);

export default function GroupsScreen() {
  const [emailFocused, setEmailFocused] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const { user } = useAuth();
  const navigation = useNavigation();

  const fetchMyGroups = useCallback(() => {
    if (!user?.id) return;

    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "community_members"),
      async (cmSnapshot) => {
        try {
          const myDocs = cmSnapshot.docs
            .map((docSnap) => {
              const data = docSnap.data();
              if (
                Array.isArray(data.members) &&
                data.members.some((m) => m.user_id === user.id)
              ) {
                return {
                  communityId: data.comm_unity_id,
                  memberCount: data.members.length,
                };
              }
              return null;
            })
            .filter(Boolean);

          const communityIds = myDocs.map((doc) => doc.communityId);
          const memberCountMap = Object.fromEntries(
            myDocs.map((doc) => [doc.communityId, doc.memberCount])
          );

          const [lastSeenMap, latestMsgMap] = await Promise.all([
            fetchAllLastSeen(user.id),
            fetchLatestMessages(communityIds),
          ]);

          const communityData = await Promise.all(
            communityIds.map(async (cid) => {
              const snap = await getDoc(doc(db, "communities", cid));
              if (!snap.exists()) return null;

              const lastSeen = lastSeenMap[cid];
              const latestMessage = latestMsgMap[cid];
              const hasUnread =
                latestMessage && (!lastSeen || latestMessage > lastSeen);

              return {
                id: snap.id,
                ...snap.data(),
                hasUnread,
                latestMessage,
                memberCount: memberCountMap[cid] || 0,
              };
            })
          );

          const sortedGroups = communityData.filter(Boolean).sort((a, b) => {
            const timeA = a.latestMessage ? a.latestMessage.getTime() : 0;
            const timeB = b.latestMessage ? b.latestMessage.getTime() : 0;
            return timeB - timeA;
          });

          setMyGroups(sortedGroups);
          setFilteredGroups(sortedGroups);
        } catch (err) {
          console.error("Error processing groups:", err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to groups:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  const fetchAllLastSeen = async (userId) => {
    const q = query(
      collection(db, "community_last_seen"),
      where("adminId", "==", userId)
    );
    const snapshot = await getDocs(q);

    const map: Record<string, Date | undefined> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      map[data.communityId] = data.lastSeen?.toDate();
    });
    return map;
  };

  const fetchLatestMessages = async (communityIds) => {
    if (communityIds.length === 0) return {};

    const q = query(
      collection(db, "community_messages"),
      where("community_id", "in", communityIds)
    );

    const snapshot = await getDocs(q);
    const latestMap: Record<string, Date> = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const time = data.timestamp?.toDate();

      if (
        !latestMap[data.community_id] ||
        time > latestMap[data.community_id]
      ) {
        latestMap[data.community_id] = time;
      }
    });
    return latestMap;
  };

  const navigateToChat = (group) => {
    (navigation as any).navigate("Groups/GroupScreen", {
      data: group,
      communityId: group.id,
      type: group.type,
      name: group.name,
      memberCount: group.memberCount,
    });
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "No messages";
    const now = new Date();
    const diff = (now - timestamp) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredGroups(myGroups);
    } else {
      const lowerSearch = searchText.toLowerCase();
      setFilteredGroups(
        myGroups.filter(
          (group) =>
            group.name?.toLowerCase().includes(lowerSearch) ||
            group.description?.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [searchText, myGroups]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <AppHeader />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Groups</Text>
            <Text style={styles.subTitle}>
              Connect with university communities
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
            <MaterialIcons name="people" color={"#ffffff"} size={24} />
          </View>
        </View>

        <View style={CommonStyles.inputContainer}>
          <View
            style={[
              CommonStyles.emailInputWrapper,
              emailFocused && CommonStyles.focusedInput,
            ]}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#777" />
            <TextInput
              style={CommonStyles.textInput}
              placeholder="Search Communities"
              placeholderTextColor="#777777"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3D83F5"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) => (
              <GroupCard
                item={item}
                onPress={() => navigateToChat(item)}
                timeAgo={timeAgo}
              />
            )}
          />
        )}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container2: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
    marginTop: 10,
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
    padding: 14,
    borderWidth: 0.8,
    borderColor: "#ececec",
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: "#fff",
    elevation: 1,
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
});
