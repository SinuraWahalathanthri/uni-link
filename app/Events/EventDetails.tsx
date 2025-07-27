import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { getEvent } from "@/services/StorageServices";
import { Timestamp } from "firebase/firestore";
import { WebView } from 'react-native-webview';

type EventItem = {
  id: string;
  date: string;
  title: string;
  imageUrl: any;
  description: string;
  hostedBy: string;
  location: string;
  time: string;
  createdAt: string;
  status: string;
};

const EventDetails = () => {
  const route = useRoute();
  const { eventId } = route.params;

  const [eventData, setEventData] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "",
          headerTitleStyle: { color: "#ffffff" },
          headerShadowVisible: false,
          headerTransparent: true,
          headerTintColor: "#ffffff",
        }}
      />
      <Image source={{ uri: eventData?.imageUrl }} style={styles.authorImage} />
      <ScrollView
        style={{ marginTop: 16, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 5 }}>
          <Text
            style={{ fontFamily: "LatoBold", fontSize: 12, color: "#3D83F5" }}
          >
            {eventData?.hostedBy}
          </Text>
          <Text style={{ fontFamily: "LatoBold", fontSize: 24, color: "#000" }}>
            {eventData?.title}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          {/* <Pressable
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: "#E6E5E7",
              borderRadius: 100,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="star" size={20} color="#000000" />
            <Text style={{ fontFamily: "LatoBold", fontSize: 14 }}>
              Interested
            </Text>
          </Pressable> */}
        </View>

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
                fontSize: 13,
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
                fontSize: 13,
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
            <MaterialIcons name="location-on" size={18} color="#000000" />
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 13,
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
          <Text style={{ fontFamily: "LatoBold", fontSize: 16, color: "#000" }}>
            Event Details
          </Text>
          <Text
            style={{
              fontFamily: "Lato",
              fontSize: 14,
              color: "#575757",
              textAlign: "justify",
              marginTop: 10,
            }}
          >
            {eventData?.description}
          </Text>
        </View>

        {eventData?.location && (
          <View style={{ height: 200, marginTop: 16 }}>
            <WebView
              source={{ uri: eventData.location }}
              style={{ borderRadius: 10 }}
            />
          </View>
        )}
      </ScrollView>
      <View
        style={{ padding: 16, position: "absolute", bottom: 0, width: "100%" }}
      >
        <Pressable
          style={{
            paddingVertical: 12,
            backgroundColor: "#3D83F5",
            borderRadius: 100,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: Platform.OS === "android" ? 50 : 20,
            gap: 8,
          }}
        >
          <MaterialIcons name="calendar-month" size={20} color="#ffffff" />
          <Text style={{ fontFamily: "LatoBold", fontSize: 14, color: "#fff" }}>
            Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  authorImage: {
    width: "100%",
    height: "30%",
    opacity: 0.9,
    resizeMode: "cover",
  },
});
