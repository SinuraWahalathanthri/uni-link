import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Pressable,
  ScrollView,
  Image,
  Alert,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/FirebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

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
  status: "active" | "claimed" | "resolved";
}

const CommentItem = ({ comment, timeAgo }) => (
  <View style={styles.commentContainer}>
    <View style={styles.commentHeader}>
      <View style={styles.commentUserInfo}>
        <View style={styles.commentAvatar}>
          <Text style={styles.commentAvatarText}>
            {comment.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.commentUserName}>{comment.userName}</Text>
          <Text style={styles.commentTime}>{timeAgo(comment.timestamp)}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.commentText}>{comment.text}</Text>
  </View>
);

export default function ItemDetailsScreen() {
  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params as { itemId: string };

  const fetchItemDetails = useCallback(async () => {
    try {
      const itemDoc = await getDoc(doc(db, "lost_and_found", itemId));
      if (itemDoc.exists()) {
        const data = itemDoc.data();

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

        setItem({
          id: itemDoc.id,
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
        });
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  const fetchComments = useCallback(() => {
    const q = query(
      collection(db, "lost_and_found_comments"),
      where("itemId", "==", itemId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const commentsData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();

              // Fetch user details for each comment
              let userName = "Unknown User";
              try {
                const userDoc = await getDoc(doc(db, "students", data.userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  userName = userData.name || "Unknown User";
                }
              } catch (err) {
                console.error("Error fetching comment user details:", err);
              }

              return {
                id: docSnap.id,
                text: data.text,
                userId: data.userId,
                userName,
                timestamp: data.timestamp?.toDate() || new Date(),
              } as Comment;
            })
          );

          setComments(commentsData);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      },
      (error) => {
        console.error("Error listening to comments:", error);
      }
    );

    return unsubscribe;
  }, [itemId]);

  useEffect(() => {
    fetchItemDetails();
    const unsubscribe = fetchComments();
    return unsubscribe;
  }, [fetchItemDetails, fetchComments]);

  const timeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = (now.getTime() - timestamp.getTime()) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to comment.");
      return;
    }

    setSubmittingComment(true);

    try {
      await addDoc(collection(db, "lost_and_found_comments"), {
        itemId,
        text: newComment.trim(),
        userId: user.id,
        timestamp: serverTimestamp(),
      });

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClaim = async () => {
    if (!user?.id || !item) return;

    setClaiming(true);

    try {
      // Check if user has already claimed this item
      const existingClaimsQuery = query(
        collection(db, "lost_and_found_claims"),
        where("itemId", "==", itemId),
        where("userId", "==", user.id)
      );

      const existingClaims = await getDocs(existingClaimsQuery);

      if (!existingClaims.empty) {
        Alert.alert("Already Claimed", "You have already claimed this item.");
        setClaiming(false);
        return;
      }

      // Add claim
      await addDoc(collection(db, "lost_and_found_claims"), {
        itemId,
        userId: user.id,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      // Add notification comment
      await addDoc(collection(db, "lost_and_found_comments"), {
        itemId,
        text: `${
          user.name || "Someone"
        } has claimed this item. The owner will be notified.`,
        userId: "system",
        timestamp: serverTimestamp(),
        isSystemMessage: true,
      });

      Alert.alert(
        "Claim Submitted",
        "Your claim has been submitted. The item owner will be notified and can contact you if this is their item."
      );
    } catch (error) {
      console.error("Error claiming item:", error);
      Alert.alert("Error", "Failed to claim item. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const handleMarkAsResolved = async () => {
    if (!item || item.userId !== user?.id) return;

    Alert.alert(
      "Mark as Resolved",
      "Are you sure you want to mark this item as resolved? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Resolve",
          style: "destructive",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "lost_and_found", itemId), {
                status: "resolved",
              });

              Alert.alert("Success", "Item has been marked as resolved.");
              navigation.goBack();
            } catch (error) {
              console.error("Error marking item as resolved:", error);
              Alert.alert("Error", "Failed to mark item as resolved.");
            }
          },
        },
      ]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3D83F5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found</Text>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable onPress={goBack} style={styles.headerBackButton}>
            <MaterialIcons name="arrow-back" size={24} color="#3A3A3A" />
          </Pressable>
          <View style={styles.headerBadges}>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor: item.type === "lost" ? "#FF6B35" : "#16a34a",
                },
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
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "active"
                      ? "#3D83F5"
                      : item.status === "claimed"
                      ? "#FF9500"
                      : "#16a34a",
                },
              ]}
            >
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Item Image */}
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        )}

        {/* Item Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaRow}>
              <Feather name="map-pin" size={16} color="#777777" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <Feather name="clock" size={16} color="#777777" />
              <Text style={styles.metaText}>{timeAgo(item.datePosted)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Feather name="user" size={16} color="#777777" />
              <Text style={styles.metaText}>{item.userName}</Text>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Action Buttons */}
          {item.status === "active" && (
            <View style={styles.actionButtonsContainer}>
              {item.userId === user?.id ? (
                <Pressable
                  style={styles.resolveButton}
                  onPress={handleMarkAsResolved}
                >
                  <MaterialIcons name="check" size={20} color="#ffffff" />
                  <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    styles.claimButton,
                    claiming && styles.claimButtonDisabled,
                  ]}
                  onPress={handleClaim}
                  disabled={claiming}
                >
                  {claiming ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <MaterialIcons
                        name="pan-tool"
                        size={20}
                        color="#ffffff"
                      />
                      <Text style={styles.claimButtonText}>
                        {item.type === "lost" ? "I Found This" : "This is Mine"}
                      </Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>
            Comments ({comments.length})
          </Text>

          {/* Add Comment */}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#999999"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[
                styles.submitCommentButton,
                (!newComment.trim() || submittingComment) &&
                  styles.submitCommentButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || submittingComment}
            >
              {submittingComment ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <MaterialIcons name="send" size={18} color="#ffffff" />
              )}
            </Pressable>
          </View>

          {/* Comments List */}
          {comments.length > 0 ? (
            <FlatList
              data={comments}
              keyExtractor={(comment) => comment.id}
              scrollEnabled={false}
              renderItem={({ item: comment }) => (
                <CommentItem comment={comment} timeAgo={timeAgo} />
              )}
            />
          ) : (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>No comments yet</Text>
              <Text style={styles.noCommentsSubtext}>
                Be the first to comment or provide information about this item
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#999999",
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "#3D83F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#ffffff",
    fontFamily: "LatoBold",
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBadges: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
    fontFamily: "LatoBold",
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
  itemImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f5f5f5",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  itemTitle: {
    fontFamily: "LatoBold",
    fontSize: 24,
    fontWeight: "600",
    color: "#3A3A3A",
    marginBottom: 16,
    lineHeight: 30,
  },
  metaInfo: {
    gap: 8,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#777777",
    marginLeft: 8,
  },
  description: {
    fontFamily: "Lato",
    fontSize: 16,
    color: "#3A3A3A",
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    gap: 12,
  },
  claimButton: {
    backgroundColor: "#3D83F5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  claimButtonDisabled: {
    backgroundColor: "#CCCCCC",
    elevation: 0,
    shadowOpacity: 0,
  },
  claimButtonText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  resolveButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resolveButtonText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderTopWidth: 0.5,
    borderTopColor: "#ececec",
    marginTop: 8,
    paddingTop: 20,
  },
  commentsSectionTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    fontWeight: "600",
    color: "#3A3A3A",
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Lato",
    fontSize: 14,
    color: "#3A3A3A",
    textAlignVertical: "top",
    minHeight: 40,
    maxHeight: 80,
  },
  submitCommentButton: {
    backgroundColor: "#3D83F5",
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  submitCommentButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  commentContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3D83F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  commentAvatarText: {
    color: "#ffffff",
    fontFamily: "LatoBold",
    fontSize: 14,
    fontWeight: "600",
  },
  commentUserName: {
    fontFamily: "LatoBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  commentTime: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#999999",
  },
  commentText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#3A3A3A",
    lineHeight: 20,
    marginLeft: 40,
  },
  noCommentsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noCommentsText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    color: "#999999",
    marginBottom: 8,
  },
  noCommentsSubtext: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
