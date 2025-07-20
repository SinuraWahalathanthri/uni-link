import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const EventDetails = () => {
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
      <Image
        source={require("../../assets/images/hackthonImage1.png")}
        style={styles.authorImage}
      />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 5 }}>
          <Text
            style={{ fontFamily: "LatoBold", fontSize: 12, color: "#3D83F5" }}
          >
            Hackathon
          </Text>
          <Text style={{ fontFamily: "LatoBold", fontSize: 24, color: "#000" }}>
            Hacktivate 2000
          </Text>
          <Text style={{ fontFamily: "Lato", fontSize: 14, color: "#6B6B6B" }}>
            by{" "}
            <Text style={{ textDecorationLine: "underline" }}>
              Hackathon Club
            </Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <Pressable
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
          </Pressable>

          <Link href={"/eventsDetails"} asChild>
            <Pressable
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: "#3D83F5",
                borderRadius: 100,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <MaterialIcons name="calendar-month" size={20} color="#ffffff" />
              <Text
                style={{ fontFamily: "LatoBold", fontSize: 14, color: "#fff" }}
              >
                Register
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={{ marginTop: 16, gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="calendar-today" size={18} color="#000000" />
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 13,
                color: "#000000",
                marginLeft: 4,
              }}
            >
              Mon, Sep 30
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="time-to-leave" size={18} color="#000000" />
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 13,
                color: "#000000",
                marginLeft: 4,
              }}
            >
              1 PM - 3 PM EDT
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
              Memorial Hall, Room 1-2, Charles Student Union
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 29,
            borderColor: "#DADADA",
            marginTop: 25,
          }}
        >
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                padding: 12,
                borderRadius: 100,
                backgroundColor: "#3D83F5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
            </View>
            <Text
              style={{ fontFamily: "LatoBold", fontSize: 16, color: "#000" }}
            >
              Invite Connections
            </Text>
          </Pressable>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum
          </Text>
        </View>
      </ScrollView>
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
