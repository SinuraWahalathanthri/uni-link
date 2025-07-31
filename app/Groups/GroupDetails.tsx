import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import LetterComponent from "@/components/chat/LetterComponent";
import { getLecturer } from "@/services/StorageServices";
import AvatarComponent from "@/components/chat/AvatarComponent";

export default function GroupDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { communityId, memberCount } = route.params;

  const [community, setCommunity] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAdminById(adminId) {
    if (!adminId) return null;
    const adminDoc = await getDoc(doc(db, "admins", adminId));
    return adminDoc.exists() ? adminDoc.data() : null;
  }

  async function fetchLecturersByIds(lecturerIds) {
    if (!lecturerIds || lecturerIds.length === 0) return [];

    const lecturers = await Promise.all(
      lecturerIds.map(async (id) => {
        try {
          const lecturer = await getLecturer(id);
          return lecturer || null;
        } catch (error) {
          console.error(`Error fetching lecturer with id ${id}:`, error);
          return null;
        }
      })
    );

    return lecturers.filter(Boolean);
  }

  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    async function fetchCommunityData() {
      try {
        setLoading(true);
        const communityDoc = await getDoc(doc(db, "communities", communityId));
        if (!communityDoc.exists()) {
          console.warn("Community not found!");
          setLoading(false);
          return;
        }
        const communityData = communityDoc.data();
        setCommunity(communityData);

        const creatorInfo = await fetchAdminById(communityData.created_by);
        setCreator(creatorInfo);

        const membersQuery = query(
          collection(db, "community_members"),
          where("comm_unity_id", "==", communityId)
        );
        const membersSnapshot = await getDocs(membersQuery);

        let membersData = [];
        let lecturerIds = [];

        membersSnapshot.forEach((doc) => {
          const data = doc.data();

          if (Array.isArray(data.members)) {
            membersData = data.members;
          }

          if (data.lecturers) {
            lecturerIds = Object.values(data.lecturers);
          }
        });

        setMembers(membersData);

        const lecturersInfo = await fetchLecturersByIds(lecturerIds);
        setAdmins(lecturersInfo);

        const imagesQuery = query(
          collection(db, "community_messages"),
          where("community_id", "==", communityId),
          where("type", "==", "image")
        );
        const imagesSnapshot = await getDocs(imagesQuery);
        const imageList = [];
        imagesSnapshot.forEach((doc) => {
          imageList.push(doc.data());
        });
        setMedia(imageList);

        const pdfsQuery = query(
          collection(db, "community_messages"),
          where("community_id", "==", communityId),
          where("type", "==", "pdf")
        );
        const pdfsSnapshot = await getDocs(pdfsQuery);
        const pdfList = [];
        pdfsSnapshot.forEach((doc) => {
          pdfList.push(doc.data());
        });
        setPdfs(pdfList);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching community data:", error);
        setLoading(false);
      }
    }

    fetchCommunityData();
  }, [communityId]);

  const getFileName = (url) => {
    if (!url) return "Untitled Document";
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffff"}}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={require("../../assets/images/main/cover.png")}
        style={styles.bannerImage}
      />
      <LetterComponent
        imageUrl={undefined}
        type={community?.type}
        style={styles.groupIcon}
      />

      <Text style={styles.title}>{community?.name}</Text>

      <View style={styles.communityRow}>
        <View style={styles.profileStack}></View>
        <Text style={styles.communityText}>
          Community - {memberCount} people
        </Text>
      </View>
      <View style={{ width: "100%", height: 1, backgroundColor: "#F4F4F4" }} />
      <Text style={styles.description}>{community?.description}</Text>
      <View style={{ width: "100%", height: 20, backgroundColor: "#F4F4F4" }} />
      <Text style={styles.sectionTitle}>Media</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mediaRow}
      >
        {media.length === 0 ? (
          <Text style={{ marginLeft: 16 }}>No media available.</Text>
        ) : (
          media.map((item, i) => (
            <Image
              key={i}
              source={{ uri: item.file_url }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                marginRight: 12,
              }}
              resizeMode="cover"
            />
          ))
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>Group Created By</Text>
      {creator ? (
        <View style={styles.creatorRow}>
          <AvatarComponent
            imageUrl={undefined}
            name={creator.name}
            size={20}
            style={styles.creatorImage}
          />
          <View>
            <Text style={{ fontWeight: "bold" }}>
              {creator.name || "Unknown"}
            </Text>
            <Text style={{ color: "gray" }}>{creator.role || "Admin"}</Text>
          </View>
        </View>
      ) : (
        <Text style={{ marginLeft: 16 }}>Loading creator info...</Text>
      )}

      <Text style={styles.sectionTitle}>Lecturers Active</Text>
      {admins.length === 0 ? (
        <Text style={{ marginLeft: 16 }}>No admins found.</Text>
      ) : (
        admins.map((admin, i) => (
          <View key={i} style={styles.creatorRow}>
            <AvatarComponent
              imageUrl={undefined}
              name={admin.name}
              size={20}
              style={[styles.creatorImage]}
            />
            <View>
              <Text style={styles.creatorName}>{admin.name || "Lecturer"}</Text>
              <Text style={styles.creatorRole}>{admin.role || "Lecturer"}</Text>
            </View>
          </View>
        ))
      )}

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 20,
          marginLeft: 16,
        }}
      >
        Documents
      </Text>
      {pdfs.length === 0 ? (
        <Text style={{ marginLeft: 16 }}>No PDFs uploaded.</Text>
      ) : (
        pdfs.map((pdf, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              padding: 12,
              borderRadius: 8,
              marginHorizontal: 16,
              marginVertical: 6,
              elevation: 1,
            }}
            onPress={() => Linking.openURL(pdf.file_url)}
          >
            <Ionicons
              name="document-text-outline"
              size={28}
              color="#e2634aff"
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
                {getFileName(pdf.file_url) || `Document ${index + 1}`}
              </Text>
              <Text style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
                PDF File
              </Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#e2634aff" />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bannerImage: { width: "100%", height: 180 },
  groupIcon: {
    width: 90,
    height: 90,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: -45,
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  communityRow: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  profileStack: {
    flexDirection: "row",
    marginBottom: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#fff",
    borderWidth: 1,
  },
  communityText: {
    fontSize: 13,
    color: "#555",
  },
  description: {
    textAlign: "left",
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: "Lato",
    color: "black",
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  mediaRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorName: {
    fontSize: 15,
    fontWeight: "500",
  },
  creatorRole: {
    fontSize: 13,
    color: "#666",
  },
  joinButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
});
