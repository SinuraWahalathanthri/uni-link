import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Avatar, Icon } from "react-native-paper";

const LetterComponent = ({ imageUrl, type, size = 60, style }) => {
  const getIconDetails = () => {
    switch ((type || "").toLowerCase()) {
      case "academic":
        return { name: "graduation-cap", color: "#4CAF50", bg: "#E8F5E9" };
      case "staff":
        return { name: "group", color: "#2196F3", bg: "#E3F2FD" };
      case "events":
        return { name: "star", color: "#FF9800", bg: "#FFF3E0" };
      default:
        return { name: "info", color: "#9E9E9E", bg: "#F5F5F5" };
    }
  };

  const renderAvatar = () => {
    if (imageUrl && imageUrl !== "no image uploaded") {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: size, height: size }, style]}
        />
      );
    } else {
      const { name, color, bg } = getIconDetails();
      return (
        <View
          style={[
            styles.iconContainer,
            { width: size, height: size, backgroundColor: bg },
            style,
          ]}
        >
          <FontAwesome name={name} size={25} color={color} />
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderAvatar()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 50,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});

export default LetterComponent;
