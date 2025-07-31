import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import AvatarComponent from "./AvatarComponent";

function ConnectedCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.row}>
            <AvatarComponent
            imageUrl={item.profileImage}
            name={item.name}
            size={58}
            style={styles.profileImage}
          />
          <View style={styles.dot2} />
        </View>
        <View style={styles.content}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text
              style={[
                styles.metaTextLight,
                { marginTop: 5, alignContent: "flex-end", fontSize: 12 },
              ]}
            >
              {/* {item.lastMessageTime || ""} */}
            </Text>
          </View>

          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={styles.metaRow}>
              <Text style={styles.tag}>{item.designation}</Text>
              {/* <Text style={styles.metaText}>{item.department}</Text> */}
            </View>

            {item.unreadCount > 0 && (
              <View style={{ marginTop: -10, marginRight: 4 }}>
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <Text numberOfLines={2} style={styles.metaTextLight}>
            {item.lastMessage || ""}
          </Text>
           <Text numberOfLines={2} style={styles.metaTextLight}>
            {item.time || ""}
          </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 60,
    height: 60,
    alignSelf: "center",
    borderRadius: 100,
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#3d83f5",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },

  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginTop: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 2,
  },
  cardTitle: {
    fontFamily: "LatoBold",
    fontSize: 16,
    lineHeight: 29,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  image: {
    width: 148,
    height: 65,
    alignSelf: "center",
    marginTop: 14,
  },
  content: {
    marginLeft: 12,
    flex: 1,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: -4,
    marginBottom: 5,
  },
  tag: {
    color: "#BF272E",
    fontFamily: "LatoBold",
    fontSize: 14,
  },
  metaText: {
    color: "#6B6B6B",
    fontFamily: "LatoBold",
    fontSize: 14,
  },
  metaTextLight: {
    color: "#6B6B6B",
    fontFamily: "Lato",
    fontSize: 14,
    marginTop: 4,
  },
  dot: {
    marginHorizontal: 6,
    color: "#6B6B6B",
    fontSize: 20,
  },
  dot2: {
    width: 10,
    height: 10,
    marginHorizontal: 6,
    backgroundColor: "#48d562",
    borderRadius: 10,
    position: "absolute",
    top: 50,
    bottom: 2,
    right: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontFamily: "LatoBold",
    color: "#3A3A3A",
    fontSize: 13,
  },
});

export default ConnectedCard;
