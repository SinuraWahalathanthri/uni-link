import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { format } from "date-fns";

export default function NewsDetail() {
  const navigation = useNavigation();
  const { news } = useLocalSearchParams();
  const data = typeof news === "string" ? JSON.parse(news) : news;

  const formattedDate = format(new Date(data.createdAt), "PPP");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 40}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Stack.Screen
          options={{
            title: "",
            headerTitleStyle: { color: "#ffffff" },
            headerShadowVisible: false,
            headerRight: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="menu" size={24} color="black" />
              </Pressable>
            ),
          }}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={data.image} style={styles.image} />
          <Text style={styles.category}>{data.category}</Text>
          <Text style={styles.title}>{data.title}</Text>

          <View style={styles.authorRow}>
            <Image
              source={require("../assets/images/profileImage.png")}
              style={styles.authorImage}
            />
            <View>
              <Text style={styles.authorName}>{data.author}</Text>
              <Text style={styles.authorRole}>Contributor</Text>
            </View>
            <Pressable style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </Pressable>
          </View>

          <Text style={styles.description}>{data.description}</Text>
        </ScrollView>

        {/* Comment Box (Fixed to bottom) */}
        <View style={styles.commentRowWrapper}>
          <View style={styles.commentRow}>
            <TextInput
              placeholder="Write a comment..."
              style={styles.commentInput}
            />
            <Pressable style={styles.sendBtn}>
              <AntDesign name="arrowright" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  category: {
    color: "#BF272E",
    fontFamily: "LatoBold",
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontFamily: "LatoBold",
    marginBottom: 16,
    color: "#000",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  authorImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  authorName: {
    fontFamily: "LatoBold",
    fontSize: 14,
  },
  authorRole: {
    fontFamily: "Lato",
    fontSize: 12,
    color: "#888",
  },
  followBtn: {
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderColor: "#000",
    borderWidth: 1,
  },
  followText: {
    fontFamily: "LatoBold",
    fontSize: 13,
  },
  description: {
    fontFamily: "Lato",
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 40,
  },
  commentRowWrapper: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    fontFamily: "Lato",
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: "#000",
    borderRadius: 999,
    padding: 8,
    marginLeft: 8,
  },
});
