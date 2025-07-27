import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import CommonStyles from "@/constants/CommonStyles";
import { useRoute } from "@react-navigation/native";
import { getLecturer } from "@/services/StorageServices";

type LectureItem = {
  id: string;
  name: string;
  designation: string;
  profileImage: string;
  biography: string;
  department: string;
  email: string;
  faculty: string;
  google_meet_link: string;
  linkedSubjects: string[];
  office_hours: {
    day: string[];
    from: string;
    to: string;
    mode: string;
  }[];
  office_location: string;
};

type Step2Props = {
  data: string;
  setPreferredDate: (value: string) => void;
  setMode: (value: string) => void;
  setPriority: (value: string) => void;
};

export default function Step2({
  data,
  setPreferredDate,
  setMode,
  setPriority,
}: Step2Props) {
  const route = useRoute();
  const { lecturerId } = route.params as { lecturerId: string };
  const meetingPreferences = ["Online", "In-Person", "Either"];
  const [lecturerData, setLecturerData] = useState<LectureItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  const priorities = [
    {
      label: "Low Priority",
      description: "General Questions, Flexible Timing",
      tag: "Low",
      color: "#dcfce7",
      value: "low",
    },
    {
      label: "Medium Priority",
      description: "Needs response within 2–3 days",
      tag: "Medium",
      color: "#fef9c3",
      value: "medium",
    },
    {
      label: "High Priority",
      description: "Urgent or time-sensitive issue",
      tag: "High",
      color: "#fee2e2",
      value: "high",
    },
  ];

  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        const data = await getLecturer(lecturerId);
        setLecturerData(data);
      } catch (error) {
        console.error("Failed to fetch lecturer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturer();
  }, [lecturerId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!lecturerData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 100 }}>
          Lecturer not found.
        </Text>
      </SafeAreaView>
    );
  }

  const SelectableButton = ({
    label,
    isSelected,
    onPress,
    style = {},
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
    style?: ViewStyle;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        CommonStyles.btnWrapper,
        {
          backgroundColor: isSelected ? "#e6f0fd" : "#ffffff",
          borderColor: isSelected ? "#2675EC" : "#EDEDED",
          borderWidth: 1.5,
          borderRadius: 6,
          paddingVertical: 10,
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      <Text
        style={{
          ...CommonStyles.textInput,
          color: isSelected ? "#2675EC" : "#000000",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      ></KeyboardAvoidingView>

      <Stack.Screen options={{ headerShown: false }} />

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
              source={
                lecturerData.profileImage === "no-image"
                  ? require("../../assets/images/main/lecturer-1.png")
                  : { uri: lecturerData.profileImage }
              }
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.name}>{lecturerData.name}</Text>
            <Text style={styles.title}>{lecturerData.designation}</Text>
            <Text style={styles.department}>{lecturerData.department}</Text>
            <Text style={styles.faculty}>{lecturerData.faculty}</Text>
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
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 8,
                }}
              >
                {["Today", "Tomorrow", "This Week", "Next Week"].map(
                  (label) => (
                    <SelectableButton
                      key={label}
                      label={label}
                      isSelected={selectedDate === label}
                      onPress={() => {
                        const newValue = selectedDate === label ? null : label;
                        setSelectedDate(newValue);
                        setPreferredDate(newValue ?? "");
                      }}
                      style={{ width: "48%" }}
                    />
                  )
                )}
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionContent}>Meeting Preference</Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedMode("in-person");
                  setMode("in-person");
                }}
                style={[
                  CommonStyles.btnWrapper,
                  {
                    width: "100%",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 10,

                    backgroundColor:
                      selectedMode === "in-person" ? "#e6f0fd" : "white",
                    borderColor:
                      selectedMode === "in-person" ? "#2675EC" : "#EDEDED",
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={25}
                  style={{
                    alignSelf: "center",
                    color: selectedMode === "in-person" ? "#2675EC" : "#000000",
                  }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      ...CommonStyles.textInput,
                      color:
                        selectedMode === "in-person" ? "#2675EC" : "#000000",
                    }}
                  >
                    In-Person Only
                  </Text>
                  <Text style={{ fontFamily: "Lato", color: "grey" }}>
                    CS Building, Room 1
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedMode("virtual");
                  setMode("virtual");
                }}
                style={[
                  CommonStyles.btnWrapper,
                  {
                    width: "100%",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor:
                      selectedMode === "virtual" ? "#e6f0fd" : "white",
                    borderColor:
                      selectedMode === "virtual" ? "#2675EC" : "#EDEDED",
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Ionicons
                  name="videocam-outline"
                  size={25}
                  style={{
                    alignSelf: "center",
                    color: selectedMode === "virtual" ? "#2675EC" : "#000000",
                  }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      ...CommonStyles.textInput,
                      color: selectedMode === "virtual" ? "#2675EC" : "#000000",
                    }}
                  >
                    Virtual Meeting
                  </Text>
                  <Text style={{ fontFamily: "Lato", color: "grey" }}>
                    Meeting conducted online
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionContent}>Priority Level</Text>

              {priorities.map((priority, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedPriority(priority.value);
                    setPriority(priority.value);
                  }}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                    gap: 5,
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
                        padding: 12,
                        borderRadius: 10,

                        backgroundColor:
                          selectedPriority === priority.value
                            ? "#e6f0fd"
                            : "white",
                        borderColor:
                          selectedPriority === priority.value
                            ? "#2675EC"
                            : "#EDEDED",
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={25}
                      style={{
                        alignSelf: "center",
                        color:
                          selectedPriority === priority.value
                            ? "#2675EC"
                            : "#000000",
                      }}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text
                        style={{
                          ...CommonStyles.textInput,
                          color:
                            selectedPriority === priority.value
                              ? "#2675EC"
                              : "#000000",
                        }}
                      >
                        {priority.label}
                      </Text>
                      <Text style={{ fontFamily: "Lato", color: "grey" }}>
                        {priority.description}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: priority.color,
                        padding: 8,
                        paddingHorizontal: 12,
                        borderRadius: 100,
                        position: "absolute",
                        right: 10,
                        top: 10,
                      }}
                    >
                      <Text>{priority.tag}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
