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
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import CommonStyles from "@/constants/CommonStyles";
import AppHeader from "@/components/main/Header";
import { Link, useNavigation } from "expo-router";
import {
  getConnectedLecturers,
  getLecturerChats,
  getLecturers,
} from "@/services/StorageServices";
import ConnectedCard from "@/components/chat/ConnectedCard";
import DiscoverCard from "@/components/chat/DiscoverCard";
import { ActivityIndicator, Modal } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";

const Connected = ({ item, onPress }) => (
  <ConnectedCard item={item} onPress={onPress} />
);

const Discover = ({ item, onPress }) => (
  <DiscoverCard item={item} onPress={onPress} />
);

export default function ChatScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"connected" | "discover">(
    "connected"
  );
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [connectedLecturers, setConnectedLecturers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFilteredLecturers = async () => {
    try {
      setLoading(true);
      const lecturerList = await getLecturers(searchText);
      setLecturers(lecturerList);
    } catch (error) {
      console.error("Failed to fetch lecturers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnected = async () => {
    try {
      setLoading(true);
      const chats = await getLecturerChats(user);
      setConnectedLecturers(chats);
    } catch (error) {
      console.error("Failed to fetch connected lecturers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "connected") {
      fetchConnected();
    } else {
      fetchFilteredLecturers();
    }
  }, [activeTab, searchText, selectedFaculty, selectedUserType]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "connected") {
      await fetchConnected();
    } else {
      await fetchFilteredLecturers();
    }
    setRefreshing(false);
  };

  const renderCard = activeTab === "connected" ? Connected : Discover;
  const dataToRender =
    activeTab === "connected" ? connectedLecturers : lecturers;

  const navigateToChat = (lecturer) => {
    navigation.navigate("Chat/ChatScreen", { lecturerId: lecturer.id });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <AppHeader />
        <View>
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
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                value={searchText}
                onChangeText={setSearchText}
              />

              {/* <MaterialIcons
                onPress={() => setFilterVisible(true)}
                name="filter-list"
                size={24}
                color="#9b9b9bff"
              /> */}
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={dataToRender}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) =>
              React.createElement(renderCard, {
                item,
                onPress: () => navigateToChat(item),
              })
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#E0E0E0",
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: -6,
                }}
              />
            )}
          />
        </View>
      </View>

      <Modal
        visible={isFilterVisible}
        onDismiss={() => setFilterVisible(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Lecturers</Text>

          <Text style={styles.sectionTitle}>Department</Text>
          {["Engineering", "Science", "Business"].map((faculty) => (
            <TouchableOpacity
              key={faculty}
              style={[
                styles.option,
                selectedFaculty === faculty && styles.selectedOption,
              ]}
              onPress={() => setSelectedFaculty(faculty)}
            >
              <Text>{faculty}</Text>
            </TouchableOpacity>
          ))}

          <Pressable
            style={styles.applyButton}
            onPress={() => setFilterVisible(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#3D83F5",
    padding: 10,
    marginLeft: 8,
    borderRadius: 6,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
    zIndex: 100,
    position: "absolute",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    marginTop: 10,
    fontWeight: "bold",
  },
  option: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginTop: 6,
  },
  selectedOption: {
    backgroundColor: "#d0e3ff",
  },
  applyButton: {
    backgroundColor: "#3D83F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 55,
    marginTop: 16,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  ///filter
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
