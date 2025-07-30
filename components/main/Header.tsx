import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const navigation = useNavigation();

  const navigateToProfile = () => {
    navigation.navigate("Profile/Profile");
  };
  const { user } = useAuth();

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <Image
        source={require("../../assets/images/instituteLogo.png")}
        style={styles.image}
      />

      <View
        style={{
          flexDirection: "row",
          gap: 16,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name="magnify" size={24} />
        <MaterialCommunityIcons name="bell-outline" size={24} />

        <TouchableOpacity>
          <Image
            source={{
              uri:
                user?.profileImage ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  image: {
    width: 148,
    height: 65,
    alignSelf: "center",
    marginTop: 14,
  },
  profileImage: {
    width: 40,
    height: 40,
    alignSelf: "center",
    borderRadius:100,
  },
  title: {
    fontFamily: "LatoBold",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "600",
  },
  subTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#6B6B6B",
  },
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 20,
    color: "#505050",
  },
  emailInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  focusedInput: {
    borderColor: "#3D83F5",
    borderWidth: 1,
  },
});
