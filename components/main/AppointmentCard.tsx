import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { format } from "date-fns";
import AvatarComponent from "../chat/AvatarComponent";
import { useNavigation } from "expo-router";

const AppointmentCard = ({ item }) => {
  const navigation = useNavigation();

  const handleJoinMeeting = () => {
    if (item.lecturer?.google_meet_link) {
      Linking.openURL(item.lecturer.google_meet_link);
    } else {
      alert("Meeting link not available");
    }
  };

  const formattedDate = item.scheduledDateTime
    ? format(item.scheduledDateTime.toDate(), "EEEE, d MMMM")
    : "No date scheduled";

  const formattedTime =
    item.sessionStartTime && item.sessionEndTime
      ? `${format(item.sessionStartTime.toDate(), "HH:mm a")} - ${format(
          item.sessionEndTime.toDate(),
          "HH:mm a"
        )}`
      : item.scheduledDateTime
      ? format(item.scheduledDateTime.toDate(), "HH:mm a")
      : "No time";

  console.log("StartTime:", item.sessionStartTime);
  console.log("EndTime:", item.sessionEndTime);

  const navigateToChat = (lecturerId: string) => {
    navigation.navigate("Chat/ChatScreen", { lecturerId: item.lecturer.id });
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.profileRow}>
          <AvatarComponent
            imageUrl={item.lecturer?.profileImage}
            name={item.lecturer?.name}
            size={20}
            style={[styles.avatar]}
          />
          <View>
            <Text style={styles.name}>
              {item.lecturer?.name || "Unknown Lecturer"}
            </Text>
            <Text style={styles.role}>
              {item.lecturer?.title || "Lecturer"}
            </Text>
          </View>
        </View>

        {item.status === "started" ? (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinMeeting}
          >
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.iconButton]}
            onPress={navigateToChat}
          >
            <MaterialIcons name="chat" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.iconText}>
          <Feather name="calendar" color="white" size={18} />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.iconText}>
          <MaterialIcons name="access-time" color="white" size={20} />
          <Text style={styles.infoText}>{formattedTime}</Text>
        </View>
      </View>

      <View style={styles.extraRow}>
        <Text style={styles.extraText}>Mode: {item.mode || "-"}</Text>
        {item.mode === "in-person" ? (
          <TouchableOpacity onPress={() => Linking.openURL(item?.location)}>
            <Text
              style={[styles.extraText, { textDecorationLine: "underline" }]}
            >
              Location : {item.location}
            </Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
        <Text style={styles.extraText}>Priority: {item.priority || "-"}</Text>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {item.status === "started"
            ? "Meeting Started"
            : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  extraRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  extraText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    alignSelf: "center",
    marginVertical: 12,
    backgroundColor: "#4E72E3",
    shadowColor: "#00D0FF",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 100,
    alignSelf: "center",
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  role: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
    fontFamily: "Poppins",
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#ffff", // green button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinButtonText: {
    color: "#6279bd",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  divider: {
    height: 20,
    width: 4,
    backgroundColor: "#6279bd",
    borderRadius: 10,
  },
  bottomRow: {
    flexDirection: "row",
    backgroundColor: "#3B57AD",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: "space-between",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
    fontFamily: "Poppins",
  },
});

export default AppointmentCard;
