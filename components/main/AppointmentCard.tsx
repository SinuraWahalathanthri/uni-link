import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const AppointmentCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Profile Info */}
        <View style={styles.profileRow}>
          <Image
            source={require("../../assets/images/main/lecturer-1.png")} // Replace with actual image
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Prof. Kamal Ashoka</Text>
            <Text style={styles.role}>Senior Lecturer</Text>
          </View>
        </View>

        {/* Call Icon */}
        <View style={styles.iconButton}>
          <MaterialIcons name="call" color="white" size={20} />
        </View>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <View style={styles.iconText}>
          <Feather name="calendar" color="white" size={18} />
          <Text style={styles.infoText}>Monday, 1 March</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.iconText}>
          <MaterialIcons name="access-time" color="white" size={20} />
          <Text style={styles.infoText}>10:00 - 10:30</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width:4,
    backgroundColor: "#6279bd",
    borderRadius: 10,
  },
  bottomRow: {
    flexDirection: "row",
    backgroundColor:"#3B57AD",
    padding:10,
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
