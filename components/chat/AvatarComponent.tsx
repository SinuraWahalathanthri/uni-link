import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

const AvatarComponent = ({ imageUrl, name, size = 50, style }) => {
  const renderAvatar = () => {
    if (imageUrl && imageUrl !== "no image uploaded") {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: size, height: size }, style]}
        />
      );
    } else {
      return (
        <Avatar.Text
          size={size}
          label={name ? name.charAt(0).toUpperCase() : "?"}
          labelStyle={styles.labelStyle}
          style={[styles.avatarBackground,  style]}
        />
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
  labelStyle: {
    fontSize: 20,
    fontFamily: "LatoBold",
    color: "#3D83F5",
  },
  avatarBackground: {
    backgroundColor: "#eff4fcff",
  },
});

export default AvatarComponent;
