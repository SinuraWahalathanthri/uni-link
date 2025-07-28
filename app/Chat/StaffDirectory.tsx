import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import StaffList from "@/components/StaffList";
import { getLecturers } from "@/services/StorageServices";

const StaffDirectory = () => {
  const [emailFocused, setEmailFocused] = useState(false);

  const [lecturers, setLecturers] = useState();
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchLecturers = async () => {
      const lecturerList = await getLecturers();
      setLecturers(lecturerList);
      setLoading(false);
      console.log("Lecturers fetched:", lecturerList);
    };
    fetchLecturers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "",
          headerTitleStyle: { color: "#ffffff" },
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container]}>
        {/* Header */}
        <View>
          {/* Title and subtitle */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.title}>Stafff Directory</Text>
              <Text style={styles.subTitle}>175 staff members</Text>
            </View>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: "#3D83F5",
                borderRadius: 4,
              }}
            >
              <MaterialIcons name="menu-book" color={"#ffffff"} size={24} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.emailInputWrapper,
                emailFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={"#777777"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Search staff by name, department, or designation"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          <View>
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

export default StaffDirectory;

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
