import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const ResourceList = () => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 16,
        borderRadius: 12,
        width: "100%",
        backgroundColor: "#ffff",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: "#fee2e2",
            borderRadius: 4,
          }}
        >
          <MaterialIcons name="bookmark-outline" color={"#dc2626"} size={24} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontFamily: "LatoBold", fontSize: 16, color: "#000" }}>
            Database Systems - Lecture Series PDFs
          </Text>
          <Text
            style={{
              fontFamily: "Lato",
              fontSize: 13,
              color: "#6D6D6E",
              marginTop: 5,
            }}
          >
            Comprehensive introduction to database systems, covering basic
            concepts and terminology
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="menu-book" size={15} color="#6c7381" />
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 13,
                  color: "#6c7381",
                  marginLeft: 4,
                }}
              >
                Database Systems
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="calendar-today" size={15} color="#6c7381" />
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 13,
                  color: "#6c7381",
                  marginLeft: 4,
                }}
              >
                Week 1
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="download" size={15} color="#6c7381" />
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 13,
                  color: "#6c7381",
                  marginLeft: 4,
                }}
              >
                245
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems:"flex-end",
              marginTop:10
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, alignItems: "flex-start" }}
            >
              <Image
                source={require("../assets/images/profileImage.png")}
                style={styles.authorImage}
              />
              <View>
                <Text
                  style={{
                    fontFamily: "LatoBold",
                    fontSize: 13,
                    color: "#000000",
                  }}
                >
                  Dr. Sarah Johnsons
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    color: "#6D6D6E",
                    marginTop: 2,
                  }}
                >
                  2.4 MB
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center", }}
            >
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  backgroundColor: "#f3f4f6",
                  borderRadius: 100,
                }}
              >
                <MaterialCommunityIcons
                  name="eye-outline"
                  color={"#6D6D6E"}
                  size={24}
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  backgroundColor: "#2563eb",
                  borderRadius: 100,
                }}
              >
                <MaterialIcons
                  name="file-download"
                  color={"#ffffff"}
                  size={24}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ResourceList;

const styles = StyleSheet.create({
  authorImage: {
    width: 34,
    height: 34,
    borderRadius: 22,
  },
});
