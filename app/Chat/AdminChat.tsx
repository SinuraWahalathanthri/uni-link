import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import StaffList from "@/components/StaffList";

const AdminChat = () => {
  const navigation = useNavigation();
  const [emailFocused, setEmailFocused] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container]}>
        {/* Header */}
        <View>
          {/* Title and subtitle */}

          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <View style={{ width: 24 }} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 16,
              }}
            >
              <View>
                <Text style={styles.title}>Academic Officers</Text>
                <Text style={styles.subTitle}>
                  Connect with Admin Staff
                </Text>
              </View>
            </View>

            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: "#3D83F5",
                borderRadius: 4,
                marginRight:16
              }}
            >
              <MaterialIcons name="menu-book" color={"#ffffff"} size={24} />
            </View>
          </View>


          <View style={{padding:16}}>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                marginTop: 10,
                alignItems: "center",
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 24,
                  backgroundColor: "#3D83F5",
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#ffffff",
                  }}
                >
                  All
                </Text>
              </View>

              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Computer Science
                </Text>
              </View>
            </ScrollView>
          </View>
          <View>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                marginTop: 5,
                alignItems: "center",
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 24,
                  backgroundColor: "#8758F5",
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#ffffff",
                  }}
                >
                  All
                </Text>
              </View>

              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Professor
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Lecture
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, gap: 16 }}
        >
          <StaffList />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AdminChat;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 74 : 30,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
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
