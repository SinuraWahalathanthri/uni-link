import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  Linking,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { format } from "date-fns";
import AvatarComponent from "@/components/chat/AvatarComponent";

const ConsultationCard = ({ item }) => {
  const handleJoinMeeting = () => {
    if (item.lecturer?.google_meet_link) {
      Linking.openURL(item.lecturer.google_meet_link);
    } else {
      alert("Meeting link not available");
    }
  };
  const getCardColor = () => {
    switch (item.status) {
      case "pending":
        return "#FFA500";
      case "ended":
      case "completed":
        return "#28A745";
      case "meeting-started":
      case "accepted":
        return "#4E72E3";
      default:
        return "#4E72E3";
    }
  };

  const scheduledDate =
    item.scheduledDateTime?.toDate &&
    format(item.scheduledDateTime.toDate(), "PP");
  const startTime =
    item.sessionStartTime?.toDate &&
    format(item.sessionStartTime.toDate(), "p");
  const endTime =
    item.sessionEndTime?.toDate && format(item.sessionEndTime.toDate(), "p");

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: getCardColor() }]}
    >
      <View style={styles.topRow}>
        <View style={styles.profileRow}>
          <AvatarComponent
            imageUrl={item.lecturer?.profileImage}
            name={item.lecturer?.name}
            size={58}
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

        {item.status === "meeting-started" && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleJoinMeeting}
          >
            <MaterialIcons name="call" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.iconText}>
          <Feather name="calendar" color="white" size={18} />
          <Text style={styles.infoText}>{scheduledDate || "No date"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.iconText}>
          <MaterialIcons name="access-time" color="white" size={20} />
          <Text style={styles.infoText}>
            {startTime && endTime ? `${startTime} - ${endTime}` : "No time"}
          </Text>
        </View>
      </View>

      <View style={styles.extraRow}>
        <Text style={styles.extraText}>Mode: {item.mode || "-"}</Text>
        <Text style={styles.extraText}>Priority: {item.priority || "-"}</Text>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {item.status === "meeting-started"
            ? "Meeting Started"
            : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    alignSelf: "center",
    marginVertical: 12,
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
    borderRadius: 24,
    marginRight: 12,
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
  },
  divider: {
    height: 20,
    width: 4,
    backgroundColor: "#6279bd",
    borderRadius: 10,
  },
  bottomRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: "space-between",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
    fontFamily: "Poppins",
  },
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
});

export default ConsultationCard;
