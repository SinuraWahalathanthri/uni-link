import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import CommonStyles from "@/constants/CommonStyles";

export default function Step2() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      ></KeyboardAvoidingView>

      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Request For Consultation</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>
            <Image
              source={require("../../assets/images/main/cover.png")}
              style={styles.coverImage}
            />
            <Image
              source={require("../../assets/images/main/lecturer-1.png")}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.profileContainer}>
            <Text style={styles.name}>Prof. Kamal Ashoka</Text>
            <Text style={styles.title}>Senior lecture at Java Institute</Text>
            <Text style={styles.department}>
              Department of Computing & Information Systems
            </Text>
            <Text style={styles.faculty}>Faculty of Applied Sciences</Text>
          </View>

          {/* Office Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              When would you like to meet ?
            </Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.sectionContent}>Prefered Dates</Text>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Today</Text>
                </View>
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Tommorow</Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Today</Text>
                </View>
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Tommorow</Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Today</Text>
                </View>
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Tommorow</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionContent}>Expected Duration</Text>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Today</Text>
                </View>
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Tommorow</Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Today</Text>
                </View>
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Tommorow</Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Today</Text>
                </View>
                <View style={[CommonStyles.btnWrapper, { width: "50%" }]}>
                  <Text style={CommonStyles.textInput}>Tommorow</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionContent}>Meeting Preference</Text>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View
                  style={[
                    CommonStyles.btnWrapper,
                    {
                      width: "100%",
                      alignItems: "flex-start",
                      flexDirection: "row",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name="location-outline"
                    size={25}
                    style={{ alignSelf: "center" }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.sectionContent}>In-Person Only</Text>
                    <Text>Cs, Building,Room 1</Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  CommonStyles.btnWrapper,
                  {
                    width: "100%",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 10,
                  },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={25}
                  style={{ alignSelf: "center" }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.sectionContent}>In-Person Only</Text>
                  <Text>Cs, Building,Room 1</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionContent}>Priority Level</Text>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View
                  style={[
                    CommonStyles.btnWrapper,
                    {
                      width: "100%",
                      alignItems: "flex-start",
                      flexDirection: "row",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={25}
                    style={{ alignSelf: "center" }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.sectionContent}>Low Priority</Text>
                    <Text>General Questions, Flexible Timing</Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#dcfce7",
                      padding: 8,
                      paddingHorizontal: 12,
                      borderRadius: 100,
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  >
                    <Text>Low</Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View
                  style={[
                    CommonStyles.btnWrapper,
                    {
                      width: "100%",
                      alignItems: "flex-start",
                      flexDirection: "row",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={25}
                    style={{ alignSelf: "center" }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.sectionContent}>Low Priority</Text>
                    <Text>General Questions, Flexible Timing</Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#fef9c3",
                      padding: 8,
                      paddingHorizontal: 12,
                      borderRadius: 100,
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  >
                    <Text>Medium</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <View
                  style={[
                    CommonStyles.btnWrapper,
                    {
                      width: "100%",
                      alignItems: "flex-start",
                      flexDirection: "row",
                      alignSelf: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={25}
                    style={{ alignSelf: "center" }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.sectionContent}>Low Priority</Text>
                    <Text>General Questions, Flexible Timing</Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#fee2e2",
                      padding: 8,
                      paddingHorizontal: 12,
                      borderRadius: 100,
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  >
                    <Text>High</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {/* <TouchableOpacity style={styles.consultBtn}>
        <Text style={styles.consultText}>Request Consultation</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#F3F3F3",
    paddingTop: Platform.OS === "android" ? 74 : 30,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "LatoBold",
  },
  coverImage: {
    width: "100%",
    height: 160,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: "absolute",
    alignSelf: "center",
    bottom: -40,
    borderWidth: 3,
    borderColor: "#fff",
  },

  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "LatoBold",
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontFamily: "LatoBold",
    marginTop: 5,
    textAlign: "center",
  },
  department: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Lato",
    marginTop: 5,
    textAlign: "center",
  },
  faculty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "Lato",
    marginTop: 5,
    textAlign: "center",
  },
  connectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  linkText: {
    color: "#007bff",
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  mutualText: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Lato",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  connectBtn: {
    flex: 1,
    backgroundColor: "#2675EC",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
  },
  connectText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  chatBtn: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    fontFamily: "LatoBold",
  },
  chatText: {
    fontWeight: "600",
    fontFamily: "LatoBold",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 6,
    fontFamily: "LatoBold",
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 4,
    color: "#444",
    fontFamily: "Lato",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  consultBtn: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#2675EC",
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    fontFamily: "LatoBold",
  },
  consultText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
