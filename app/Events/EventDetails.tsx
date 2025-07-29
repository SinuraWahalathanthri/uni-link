import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { Link, Stack, useNavigation } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import {
  getEvent,
  handleRegisterParticipant,
  registerParticipant,
  unregisterParticipant,
} from "@/services/StorageServices";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { WebView } from "react-native-webview";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { db } from "@/services/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modal } from "react-native-paper";

type EventItem = {
  id: string;
  date: string;
  title: string;
  imageUrl: any;
  description: string;
  hostedBy: string;
  location: string;
  start_time: string;
  end_time: string;
  location_link: string;
  createdAt: string;
  status: string;
};

const EventDetails = () => {
  const route = useRoute();
  const { eventId } = route.params;
  const { user } = useAuth();

  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      const q = query(
        collection(db, "event_participants"),
        where("event_id", "==", eventId)
      );

      const querySnapshot = await getDocs(q);
      let found = false;

      querySnapshot.forEach((doc) => {
        const participants = doc.data().participants || [];
        if (participants.some((p: any) => p.student_id === user?.id)) {
          found = true;
        }
      });

      setAlreadyRegistered(found);
    };

    checkRegistration();
  }, [eventId]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(eventId);
        setEventData(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatTime = (firebaseTimestamp: Timestamp) => {
    const date = firebaseTimestamp.toDate();
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const extractLatLng = (url: string) => {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const queryRegex = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;

    let match = url.match(regex);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    match = url.match(queryRegex);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }

    return null;
  };

  const registerForEvent = () => {};

  const coords =
    eventData && eventData.location_link
      ? extractLatLng(eventData.location_link)
      : null;

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: eventData?.imageUrl }} style={styles.authorImage} />
      <ScrollView
        style={{ marginTop: 16, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 5 }}>
          <Text
            style={{ fontFamily: "LatoBold", fontSize: 16, color: "#3D83F5" }}
          >
            {eventData?.hostedBy}
          </Text>
          <Text style={{ fontFamily: "LatoBold", fontSize: 24, color: "#000" }}>
            {eventData?.title}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}></View>

        <View style={{ marginTop: 16, gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="calendar" size={18} color="#000000" />
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 16,
                color: "#000000",
                marginLeft: 4,
              }}
            >
              {eventData?.date.toDate().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="clock" size={18} color="#000000" />
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 16,
                color: "#000000",
                marginLeft: 4,
              }}
            >
              {eventData?.start_time.toDate().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}{" "}
              {" - "}{" "}
              {eventData?.end_time.toDate().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="location-outline" size={18} color="#000000" />
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 16,
                color: "#000000",
                marginLeft: 4,
                textDecorationLine: "underline",
              }}
            >
              {eventData?.location}
            </Text>
          </View>
        </View>
        {/* Event Details */}
        <View style={{ marginTop: 25, gap: 10 }}>
          <Text style={{ fontFamily: "LatoBold", fontSize: 18, color: "#000" }}>
            Event Details
          </Text>
          <Text
            style={{
              fontFamily: "Lato",
              fontSize: 16,
              color: "#575757",
              textAlign: "justify",
              marginTop: 10,
              lineHeight: 24,
            }}
          >
            {eventData?.description}
          </Text>
        </View>

        {coords && (
          <View
            style={{
              height: 500,
              marginTop: 16,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <MapView
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }}
                title={eventData.location}
              />
            </MapView>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          flex: 1,
          padding: 16,
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
          paddingBottom: Platform.OS === "android" ? 50 : 40,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            backgroundColor: alreadyRegistered ? "#fa4d4dff" : "#3D83F5",
            borderRadius: 100,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
          onPress={() => {
            setIsCancel(alreadyRegistered);
            setShowConfirmSheet(true);
            bottomSheetRef.current?.expand();
          }}
        >
          <MaterialIcons name="calendar-month" size={20} color="#ffffff" />
          <Text style={{ fontFamily: "LatoBold", fontSize: 14, color: "#fff" }}>
            {alreadyRegistered ? "Cancel Registration" : "Register"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showConfirmSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmSheet(false)}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              padding: 25,
              borderRadius: 20,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "LatoBold",
                textAlign: "center",
                marginBottom: 20,
                color: "#333",
              }}
            >
              {isCancel ? "Cancel Registration?" : "Confirm Participation?"}
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontFamily: "Lato",
                textAlign: "center",
                color: "#666",
                marginBottom: 25,
              }}
            >
              {isCancel
                ? "Are you sure you want to cancel your registration for this event?"
                : "Do you want to confirm your participation for this event?"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  backgroundColor: "#aaa",
                  borderRadius: 50,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => setShowConfirmSheet(false)}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  backgroundColor: isCancel ? "#E53935" : "#3D83F5",
                  borderRadius: 50,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={async () => {
                  try {
                    if (isCancel) {
                      await unregisterParticipant(eventId, user?.id);
                      setAlreadyRegistered(false);
                    } else {
                      await registerParticipant(eventId, user?.id);
                      setAlreadyRegistered(true);
                    }
                  } catch (err) {
                    Alert.alert("Error", "Failed. Please try again.");
                  } finally {
                    setShowConfirmSheet(false);
                  }
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 , fontFamily:"Lato"}}>
                  {isCancel ? "Yes, Cancel" : "Yes, Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#F3F3F3",
    paddingTop: Platform.OS === "android" ? 74 : 50,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "LatoBold",
  },
  authorImage: {
    width: "100%",
    height: "30%",
    opacity: 0.9,
    resizeMode: "cover",
  },
});
