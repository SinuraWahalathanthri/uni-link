import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AvatarComponent from "../chat/AvatarComponent";

const ImageCard = ({ name, role, time, imageUrl, showHeader = true }) => {
  return (
    <View style={styles.messageCard}>
      {showHeader && (
        <View style={styles.row}>
          <AvatarComponent
            imageUrl={undefined}
            name={name}
            size={35}
            style={styles.creatorImage}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            {role && <Text style={styles.role}>{role}</Text>}
          </View>
        </View>
      )}

      <Image
        source={{ uri: imageUrl }}
        style={styles.mainImage}
      />
      
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text></Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  creatorImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 12,
  },
  messageCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    maxWidth: "75%",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
  },
  name: {
    fontWeight: "bold",
    fontFamily: "LatoBold",
    fontSize: 14,
    color: "#26874C",
  },
  role: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "LatoBold",
    marginBottom: 4,
  },
  mainImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
    marginRight: 10,
  },
});

export default ImageCard;
