import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image } from "expo-image";

const StaffList = () => {
  return (
    <View
      style={{
        padding: 12,
        borderWidth: 1,
        borderColor: "#D7D7D7",
        borderRadius: 12,
        marginTop: 13,
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12, flex: 1, width: "100%" }}>
        <View style={{ borderRadius: 12, marginBottom: 10 }}>
          <Image
            source={require("../assets/images/lectureImage.png")}
            style={{ width: 91, height: 91, borderRadius: 12 }}
            contentFit="cover"
          />
          <View
            style={{
              width: 13,
              height: 13,
              backgroundColor: "#48D562",
              position: "absolute",
              bottom: 8,
              right: -2,  
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#fff",
            }}
          ></View>
        </View>

        <View style={{ marginBottom: 8, gap: 4, flex: 1 }}>
          <Text style={{ fontFamily: "LatoBold", fontSize: 16, color: "#000" }}>
            Prof. Tharaka Prasanna
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "LatoBold",
                fontSize: 14,
                color: "#3D83F5",
                lineHeight: 20,
              }}
            >
              Senior Lecturer
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 13,
                  color: "#919191",
                  lineHeight: 20,
                }}
              >
                Computer Science
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 18,
                  backgroundColor: "#DBEAFE",
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "LatoBold",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#2A4BB4",
                  }}
                >
                  Machine Learning
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 18,
                  backgroundColor: "#DBEAFE",
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "LatoBold",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#2A4BB4",
                  }}
                >
                  Database System
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 18,
                  backgroundColor: "#f3f4f6",
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "LatoBold",
                    fontSize: 11,
                    lineHeight: 28,
                    color: "#5D6673",
                  }}
                >
                  +1 more
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
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
            <MaterialIcons name="chat-bubble-outline" size={20} color="#ffffff" />
            <Text
              style={{ fontFamily: "LatoBold", fontSize: 14, color: "#fff" }}
            >
              Start Chat
            </Text>
          </Pressable>
        </Link>
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
          <Text style={{ fontFamily: "LatoBold", fontSize: 14 }}>
            View Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default StaffList;

const styles = StyleSheet.create({});
