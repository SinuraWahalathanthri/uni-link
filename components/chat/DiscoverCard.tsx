import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import AvatarComponent from "./AvatarComponent";

type LectureItem = {
  id: string;
  name: string;
  designation: string;
  profileImage: string;
  biography: string;
  department: string;
  email: string;
  faculty: string;
  google_meet_link: string;
  linkedSubjects: string[];
  office_hours: {
    day: string[];
    from: string;
    to: string;
    mode: string;
  }[];
  office_location: string;
};

function DiscoverCard({ item, onPress }) {
  const navigation = useNavigation();
  const lecturerId = item.id;

  const navigateToChat = (lecturerId: string) => {
    navigation.navigate("Chat/ChatScreen", { lecturerId });
  };

  const navigateToProfile = (lectureId: string) => {
    navigation.navigate("Lecturer/LecturerProfile", {
      lecturerId: lectureId,
    });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.imageWrapper}>

          <AvatarComponent
            imageUrl={item.profileImage}
            name={item.name}
            size={58}
            style={styles.image}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.titleText}>{item.designation} </Text>
          <Text style={styles.subTitleText}>{item.department}</Text>

          <ScrollView
            horizontal
            contentContainerStyle={styles.tagScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {item.linkedSubjects?.slice(0, 2).map((subject, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{subject}</Text>
              </View>
            ))}

            {item.linkedSubjects?.length > 2 && (
              <View style={styles.tagMuted}>
                <Text style={styles.tagMutedText}>
                  +{item.linkedSubjects.length - 2} more
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.chatButton}
          onPress={() => navigateToChat(lecturerId)}
        >
          <MaterialIcons name="chat-bubble-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Chat</Text>
        </Pressable>
        <Pressable
          style={styles.profileButton}
          onPress={() => navigateToProfile(lecturerId)}
        >
          <Text style={styles.buttonSecondaryText}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 14,
    borderWidth: 0.8,
    borderColor: "#ececec",
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: "#fff",
    elevation: 1,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 14,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 12,
  },
  statusIndicator: {
    width: 15,
    height: 15,
    backgroundColor: "#48D562",
    position: "absolute",
    bottom: 6,
    right: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#fff",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginTop:10
  },
  nameText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    color: "#111",
  },
  titleText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#3D83F5",
    marginTop: 2,
  },
  subTitleText: {
    fontFamily: "Lato",
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  tagScrollContainer: {
    // flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EEF4FF",
    borderRadius: 50,
    alignSelf: "center",
  },
  tagText: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#2A4BB4",
  },
  tagMuted: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    alignSelf: "center",
  },
  tagMutedText: {
    fontFamily: "Lato",
    fontSize: 11,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  chatButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#3D83F5",
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonText: {
    fontFamily: "LatoBold",
    fontSize: 13,
    color: "#fff",
  },
  profileButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#F2F3F5",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSecondaryText: {
    fontFamily: "LatoBold",
    fontSize: 13,
    color: "#333",
  },
});

export default DiscoverCard;
