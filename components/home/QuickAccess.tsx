import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

function QuickAccess() {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <Text
          style={{
            fontFamily: "LatoBold",
            fontSize: 18,
            lineHeight: 20,
            color: "#000000",
          }}
        >
          Quick Access
        </Text>
      </View>

      <View style={{ width: "100%" }}>
        {/* Row 1 */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 12,
            marginTop: 16,
          }}
        >
          {/* Column 1 */}
          <Pressable
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 16,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#CFCFCF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#3D83F5",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  marginTop: 10,
                }}
              >
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={24}
                  color="#ffffff"
                />
              </View>

              <View
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 5,
                  borderRadius: 100,
                  backgroundColor: "red",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 12,
                    lineHeight: 15,
                    color: "white",
                  }}
                >
                  1
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 14,
                lineHeight: 19,
                color: "#000000",
                marginTop: 5,
              }}
            >
              Chat with Lectures
            </Text>
          </Pressable>

          {/* Column 2 */}
          <Pressable
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 16,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#CFCFCF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#20C660",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  marginTop: 10,
                }}
              >
                <MaterialIcons name="people-alt" size={24} color="#ffffff" />
              </View>

              <View
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 5,
                  borderRadius: 100,
                  backgroundColor: "red",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 12,
                    lineHeight: 15,
                    color: "white",
                  }}
                >
                  5
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 14,
                lineHeight: 19,
                color: "#000000",
                marginTop: 5,
              }}
            >
              Join Event Groups
            </Text>
          </Pressable>
        </View>

        {/* Row 2 */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 12,
            marginTop: 10,
          }}
        >
          {/* Column 1 */}
          <Pressable
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 16,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#CFCFCF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#F87216",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  marginTop: 10,
                }}
              >
                <MaterialIcons name="info-outline" size={24} color="#ffffff" />
              </View>
            </View>
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 14,
                lineHeight: 19,
                color: "#000000",
                marginTop: 5,
              }}
            >
              Get Help
            </Text>
          </Pressable>
          {/* Column 2 */}
          <Link href={"/resources"} asChild>
            <Pressable
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 16,
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#CFCFCF",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#A357FF",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    marginTop: 10,
                  }}
                >
                  <MaterialIcons name="menu-book" size={24} color="#ffffff" />
                </View>
              </View>
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 14,
                  lineHeight: 19,
                  color: "#000000",
                  marginTop: 5,
                }}
              >
                Resources
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}

export default QuickAccess;
