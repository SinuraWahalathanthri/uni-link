import { Image } from "expo-image";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "expo-router";
import { formatDistanceToNow } from "date-fns";

const newsData = [
  {
    id: "1",
    title: "University Exam Schedule Released",
    category: "Exam",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
    author: "Deepal Kodithuwakku",
    department: "All Departments",
    image: require("../../assets/images/hackthonImage.png"),
    createdAt: "2024-07-14T08:00:00Z", // ISO string
    readDuration: 4, // in minutes
  },
  {
    id: "2",
    title: "New Online Portal Launch",
    category: "Notice",
    description:
      "The new student portal offers better performance and a user-friendly interface for academic updates and communication.",
    author: "IT Department",
    department: "All Departments",
    image: require("../../assets/images/hackthonImage.png"),
    createdAt: "2024-07-13T14:30:00Z",
    readDuration: 3,
  },
];

const NewsCard = ({ item }) => {
  const navigation = useNavigation<any>();

  const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
  });
  const readTime = `${item.readDuration} min read`;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("newsDetail", { news: JSON.stringify(item) })
      }
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#D7D7D7",
        borderRadius: 12,
        marginTop: 13,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={item.image}
          style={{ width: 90, height: 90, borderRadius: 8 }}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text
            style={{ fontFamily: "LatoBold", fontSize: 16, lineHeight: 20 }}
          >
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Text style={{ fontFamily: "LatoBold", color: "#BF272E" }}>
              {item.category}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={{ fontFamily: "LatoBold", color: "#434343" }}>
                {timeAgo}
              </Text>
              <Text style={{ fontFamily: "LatoBold", color: "#434343" }}>
                •
              </Text>
              <Text style={{ fontFamily: "LatoBold", color: "#434343" }}>
                {readTime}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: "Lato",
              fontSize: 14,
              lineHeight: 18,
              color: "#6B6B6B",
              marginTop: 4,
            }}
            numberOfLines={4}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontFamily: "LatoBold", color: "#434343" }}>
            {item.author}
          </Text>
          <Text style={{ fontFamily: "LatoBold", color: "#434343" }}>•</Text>
          <Text style={{ fontFamily: "LatoBold", color: "#434343" }}>
            {item.department}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="bookmark-outline"
          size={24}
          color="#3D83F5"
        />
      </View>
    </Pressable>
  );
};

export default function NewsScreen() {
  const [emailFocused, setEmailFocused] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        {/* Header */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../../assets/images/instituteLogo.png")}
            style={styles.image}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="magnify" size={24} />
            <MaterialCommunityIcons name="bell-outline" size={24} />

            <Image
              source={require("../../assets/images/profileImage.png")}
              style={styles.profileImage}
            />
          </View>
        </View>
        <View>
          {/* Title and subtitle */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.title}>News</Text>
              <Text style={styles.subTitle}>
                Get updates about the latest news.
              </Text>
            </View>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: "#3D83F5",
                borderRadius: 4,
              }}
            >
              <MaterialIcons name="add" color={"#ffffff"} size={24} />
            </View>
          </View>
          <View>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                marginTop: 20,
                alignItems: "center",
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 24,
                  backgroundColor: "#3D83F5",
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#ffffff",
                  }}
                >
                  All
                </Text>
              </View>

              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Exam
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Exam
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Exam
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 24,
                  backgroundColor: "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: "#DADADA",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontSize: 13,
                    lineHeight: 28,
                    color: "#707275",
                  }}
                >
                  Exam
                </Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.emailInputWrapper,
                emailFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={"#777777"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Search announcements"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={newsData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 80 : 40,
            }}
            renderItem={({ item }) => <NewsCard item={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  image: {
    width: 148,
    height: 65,
    alignSelf: "center",
    marginTop: 14,
  },
  profileImage: {
    width: 40,
    height: 40,
    alignSelf: "center",
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
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 14,
    lineHeight: 20,
    color: "#505050",
  },
  emailInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 100,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  focusedInput: {
    borderColor: "#3D83F5",
    borderWidth: 1,
  },
});
