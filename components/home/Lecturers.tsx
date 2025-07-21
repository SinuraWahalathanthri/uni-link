import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";

function Lecturers() {
  const lectureData = [
    {
      id: "1",
      lecutureName: "Prof. Ajith Fernando",
      title: "Senior Lecture",
      image: require("../../assets/images/lectureImage.png"),
    },
    {
      id: "2",
      lecutureName: "Prof. Ajith Fernando",
      title: "Senior Lecture",
      image: require("../../assets/images/lectureImage.png"),
    },
  ];
  const LectureCard = ({ item }) => (
    <Pressable style={styles.lectureCard}>
      <Image source={item.image} style={styles.lectureImage} />
      <Pressable style={styles.lectureOverlay} />
      <View style={styles.lectureTextContainer}>
        <Text style={styles.lectureNameText}>{item.lecutureName}</Text>
        <Text style={styles.lectureTitleText}>{item.title}</Text>
      </View>
    </Pressable>
  );

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
          Connect with lectures
        </Text>
        <Link href={"/staffDirectory"} asChild>
          <Pressable>
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 15,
                lineHeight: 19,
                color: "#1A3C7C",
              }}
            >
              View all
            </Text>
          </Pressable>
        </Link>
      </View>

      <View
        style={{
          marginTop: 16,
        }}
      >
        <FlatList
          data={lectureData}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LectureCard item={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 1 }}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 246,
    borderRadius: 16,
    overflow: "hidden",
  },
  upcomingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000050",
    borderRadius: 16,
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    backgroundColor: "#FFFFFF70",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    bottom: 20,
    left: 12,
  },
  dateText: {
    fontFamily: "Lato",
    color: "#C9C9C9",
    fontSize: 16,
    lineHeight: 19,
  },
  titleText: {
    fontFamily: "Lato",
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 19,
    marginTop: 5,
  },

  // Lecuture Card Styles

  lectureCard: {
    width: 195,
    height: 198,
    borderRadius: 16,
    overflow: "hidden",
  },
  lectureImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  lectureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000050",
    borderRadius: 16,
  },
  lectureTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 12,
  },
  lectureNameText: {
    fontFamily: "Lato",
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 19,
  },
  lectureTitleText: {
    fontFamily: "Lato",
    color: "#EFEFEF",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 5,
  },
});

export default Lecturers;
