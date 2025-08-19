import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/FirebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import CommonStyles from "@/constants/CommonStyles";
import { Modal } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: "lost" | "found";
  imageUrl?: string;
  location: string;
  datePosted: Date;
  userId: string;
  userName: string;
  userEmail: string;
  status: "active" | "claimed" | "resolved" | "inactive";
  claimsCount: number;
  claimedAt?: Date;
  claimedBy?: string;
}

const LostFoundCard = ({ item, onPress, onClaim, timeAgo, currentUserId }) => {
  const isInactive = item.status === "inactive";

  return (
    <Pressable
      style={[styles.card, isInactive && styles.inactiveCard]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: item.type === "lost" ? "#FF6B35" : "#16a34a" },
            ]}
          >
            <MaterialCommunityIcons
              name={
                item.type === "lost"
                  ? "alert-circle-outline"
                  : "check-circle-outline"
              }
              size={16}
              color="#ffffff"
            />
            <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.timeAgo}>{timeAgo(item.datePosted)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "active"
                    ? "#3D83F5"
                    : item.status === "claimed"
                    ? "#FF9500"
                    : item.status === "inactive"
                    ? "#999999"
                    : "#16a34a",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === "inactive"
                ? "CLAIMED"
                : item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.cardTitle, isInactive && styles.inactiveText]}>
        {item.title}
      </Text>
      <Text
        numberOfLines={2}
        style={[styles.description, isInactive && styles.inactiveText]}
      >
        {item.description}
      </Text>

      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.itemImage, isInactive && styles.inactiveImage]}
        />
      )}

      <View style={styles.metaRow}>
        <Feather
          name="map-pin"
          size={14}
          color={isInactive ? "#CCCCCC" : "#777777"}
        />
        <Text style={[styles.locationText, isInactive && styles.inactiveText]}>
          {item.location}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <Feather
            name="user"
            size={14}
            color={isInactive ? "#CCCCCC" : "#777777"}
          />
          <Text style={[styles.authorText, isInactive && styles.inactiveText]}>
            {item.userName}
          </Text>
        </View>

        {/* Don't show claim button for inactive items */}
        {item.status === "active" && item.userId !== currentUserId && (
          <Pressable
            style={styles.claimButton}
            onPress={(e) => {
              e.stopPropagation();
              onClaim(item);
            }}
          >
            <Text style={styles.claimButtonText}>
              {item.type === "lost" ? "I Found This" : "This is Mine"}
            </Text>
          </Pressable>
        )}

        {/* Show claimed message for inactive items */}
        {isInactive && (
          <View style={styles.claimedContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color="#999999"
            />
            <Text style={styles.claimedText}>Item Claimed</Text>
          </View>
        )}

        {item.claimsCount > 0 && item.status === "active" && (
          <View style={styles.claimsContainer}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={14}
              color="#777777"
            />
            <Text style={styles.claimsText}>{item.claimsCount} claims</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default function LostAndFoundScreen() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "lost" | "found">(
    "all"
  );
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();

  const fetchLostFoundItems = useCallback(() => {
    setLoading(true);

    const q = query(
      collection(db, "lost_and_found"),
      where("status", "!=", "deactive"), // Filter out inactive items
      orderBy("status"), // Required when using != operator
      orderBy("datePosted", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const itemsData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();

              // Skip inactive items (double check)
              if (data.status === "inactive") {
                return null;
              }

              // Fetch user details
              let userName = "Unknown User";
              let userEmail = "";
              try {
                const userDoc = await getDoc(doc(db, "students", data.userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  userName = userData.name || "Unknown User";
                  userEmail = userData.email || "";
                }
              } catch (err) {
                console.error("Error fetching user details:", err);
              }

              // Fetch claims count
              const claimsQuery = query(
                collection(db, "lost_and_found_claims"),
                where("itemId", "==", docSnap.id)
              );

              let claimsCount = 0;
              try {
                const claimsSnapshot = await getDocs(claimsQuery);
                claimsCount = claimsSnapshot.size;
              } catch (err) {
                console.error("Error fetching claims count:", err);
              }

              return {
                id: docSnap.id,
                title: data.title,
                description: data.description,
                type: data.type,
                imageUrl: data.imageUrl,
                location: data.location,
                datePosted: data.datePosted?.toDate() || new Date(),
                userId: data.userId,
                userName,
                userEmail,
                status: data.status || "active",
                claimsCount,
                claimedAt: data.claimedAt?.toDate(),
                claimedBy: data.claimedBy,
              } as LostFoundItem;
            })
          );

          // Filter out null values from inactive items
          const validItems = itemsData.filter((item) => item !== null);
          setItems(validItems);
          setFilteredItems(validItems);
        } catch (error) {
          console.error("Error fetching lost and found items:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to lost and found items:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchLostFoundItems();
    return unsubscribe;
  }, [fetchLostFoundItems]);

  const timeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = (now.getTime() - timestamp.getTime()) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const filterItems = useCallback(() => {
    let filtered = items;

    // Filter by type
    if (activeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === activeFilter);
    }

    // Filter by search text
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerSearch) ||
          item.description.toLowerCase().includes(lowerSearch) ||
          item.location.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredItems(filtered);
  }, [items, activeFilter, searchText]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const navigateToCreatePost = () => {
    (navigation as any).navigate("LostAndFound/CreatePostScreen");
  };

  // Confirm claim handler
  const confirmFound = async () => {
    if (!selectedItemId) return;
    try {
      setUpdating(true);
      const docRef = doc(db, "lost_and_found", selectedItemId);

      // Update status to "inactive" instead of changing type
      await updateDoc(docRef, {
        status: "inactive",
        claimedAt: new Date(),
        claimedBy: user?.id,
      });

      // Update the local state to show the item as inactive immediately
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItemId ? { ...item, status: "inactive" } : item
        )
      );

      setUpdating(false);
      setModalVisible(false);
      Alert.alert(
        "Success",
        "The item has been marked as claimed! It will be hidden from future searches.",
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdating(false);
      Alert.alert(
        "Error",
        "Could not update the item status. Please try again."
      );
    }
  };

  const navigateToItemDetails = (item: LostFoundItem) => {
    (navigation as any).navigate("LostAndFound/ItemDetailsScreen", {
      itemId: item.id,
      item: item,
    });
  };

  const handleClaimPress = (item: LostFoundItem) => {
    setSelectedItemId(item.id);
    setModalVisible(true);
  };

  const goBack = () => {
    navigation.goBack();
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
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#3A3A3A" />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Lost & Found</Text>
            <Text style={styles.subTitle}>
              Help reunite items with their owners
            </Text>
          </View>
          <Pressable style={styles.createButton} onPress={navigateToCreatePost}>
            <MaterialIcons name="add" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {["all", "lost", "found"].map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.activeFilterTab,
              ]}
              onPress={() =>
                setActiveFilter(filter as "all" | "lost" | "found")
              }
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.activeFilterTabText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Search Bar */}
        <View style={CommonStyles.inputContainer}>
          <View
            style={[
              CommonStyles.emailInputWrapper,
              searchFocused && CommonStyles.focusedInput,
            ]}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#777" />
            <TextInput
              style={CommonStyles.textInput}
              placeholder="Search items, descriptions, locations..."
              placeholderTextColor="#777777"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Items List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3D83F5"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) => (
              <LostFoundCard
                item={item}
                onPress={() => navigateToItemDetails(item)}
                onClaim={handleClaimPress}
                timeAgo={timeAgo}
                currentUserId={user?.id}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="magnify-plus-outline"
                  size={48}
                  color="#CCCCCC"
                />
                <Text style={styles.emptyTitle}>No items found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchText.trim()
                    ? "Try adjusting your search or filters"
                    : "Be the first to post a lost or found item"}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <MaterialCommunityIcons
                  name="hand-heart"
                  size={24}
                  color="#3D83F5"
                />
              </View>
              <Text style={styles.modalTitle}>Confirm Claim</Text>
            </View>

            <Text style={styles.modalText}>
              Are you sure you want to claim this item? This action will notify
              the owner and mark the item as claimed.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  updating ? styles.loadingButton : styles.primaryButton,
                ]}
                onPress={confirmFound}
                disabled={updating}
              >
                <Text
                  style={[styles.modalButtonText, styles.primaryButtonText]}
                >
                  {updating ? "Processing..." : "Yes, Claim Item"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={() => setModalVisible(false)}
                disabled={updating}
              >
                <Text
                  style={[styles.modalButtonText, styles.secondaryButtonText]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Enhanced Modal Styles
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: "LatoBold",
    fontSize: 20,
    fontWeight: "600",
    color: "#3A3A3A",
    textAlign: "center",
    marginBottom: 8,
  },
  modalText: {
    fontFamily: "Lato",
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "column",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: "#3D83F5",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  modalButtonText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
  },
  secondaryButtonText: {
    color: "#6B6B6B",
  },
  loadingButton: {
    backgroundColor: "#B0C4DE",
  },

  // Container styles
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "LatoBold",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  subTitle: {
    marginTop: 4,
    fontFamily: "Lato",
    fontSize: 14,
    color: "#6B6B6B",
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3D83F5",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  activeFilterTab: {
    backgroundColor: "#ffffff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777777",
    fontFamily: "Lato",
  },
  activeFilterTabText: {
    color: "#3D83F5",
    fontFamily: "LatoBold",
  },
  card: {
    padding: 16,
    borderWidth: 0.8,
    borderColor: "#ececec",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inactiveCard: {
    opacity: 0.6,
    backgroundColor: "#F8F8F8",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
    fontFamily: "LatoBold",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999999",
    fontFamily: "Lato",
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "LatoBold",
  },
  cardTitle: {
    fontFamily: "LatoBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3A3A",
    marginBottom: 4,
  },
  description: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#6B6B6B",
    lineHeight: 20,
    marginBottom: 8,
  },
  inactiveText: {
    color: "#CCCCCC",
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  inactiveImage: {
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#777777",
    marginLeft: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorText: {
    fontFamily: "Lato",
    fontSize: 13,
    color: "#777777",
    marginLeft: 6,
  },
  claimButton: {
    backgroundColor: "#3D83F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  claimButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  claimedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  claimedText: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#999999",
    marginLeft: 4,
    fontWeight: "600",
  },
  claimsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  claimsText: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#777777",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#999999",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
