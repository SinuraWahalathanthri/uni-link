import { Link, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getLecturers } from "@/services/StorageServices";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

type LectureItem = {
  id: string;
  name: string;
  designation: string;
  profileImage?: string;
  biography?: string;
  department?: string;
  email: string;
  faculty?: string;
};

const Lecturers = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [lecturers, setLecturers] = useState<LectureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const lecturerList = await getLecturers("", user);
        setLecturers(lecturerList.slice(0, 5)); // top 5 lecturers
      } catch (error) {
        console.error("Error loading lecturers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, [user]);

  const navigateToProfile = (item: LectureItem) => {
    navigation.navigate("Lecturer/LecturerProfile", { lecturerId: item.id });
  };

  const navigateToChat = (lecturerId: string) => {
    navigation.navigate("Chat/ChatScreen", { lecturerId });
  };

  const navigateToConsultation = (lecturerId: string) => {
    navigation.navigate("Consultations/RequestScreen", { lecturerId });
  };

  const LectureCard = ({ item }: { item: LectureItem }) => (
    <View style={styles.lectureCard}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => navigateToProfile(item)}>
        <Image
          source={
            item.profileImage
              ? { uri: item.profileImage }
              : require("../../assets/images/main/lecturer-1.png")
          }
          style={styles.lectureImage}
        />
        <View style={styles.overlay} />
        <View style={styles.lectureTextContainer}>
          <Text numberOfLines={1} style={styles.lectureNameText}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.lectureTitleText}>
            {item.designation}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigateToChat(item.id)}
        >
          <MaterialIcons name="chat" size={18} color="#fff" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigateToConsultation(item.id)}
        >
          <MaterialIcons name="event-available" size={18} color="#fff" />
          <Text style={styles.buttonText}>Consult</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Connect with Lecturers</Text>
        <Link href={"/staffDirectory"} asChild>
          <Pressable>
            <Text style={styles.viewAllText}>View all</Text>
          </Pressable>
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#3D83F5" />
      ) : (
        <FlatList
          data={lecturers}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LectureCard item={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          ListEmptyComponent={
            <Text style={{ color: "#777", marginLeft: 10 }}>No lecturers found</Text>
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  headerTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#000",
  },
  viewAllText: {
    fontFamily: "Lato",
    fontSize: 15,
    color: "#1A3C7C",
  },
  lectureCard: {
    width: 160,
    height: 230,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  lectureImage: {
    width: "100%",
    height: 150,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000040",
    height: 150,
  },
  lectureTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  lectureNameText: {
    fontFamily: "LatoBold",
    color: "#fff",
    fontSize: 16,
  },
  lectureTitleText: {
    fontFamily: "Lato",
    color: "#e0e0e0",
    fontSize: 13,
    marginTop: 3,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3D83F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    fontFamily: "LatoBold",
    color: "#fff",
    fontSize: 13,
    marginLeft: 4,
  },
});

export default Lecturers;
