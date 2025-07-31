import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import AvatarComponent from "../chat/AvatarComponent";

const DocumentCard = ({ name, role, time, fileUrl, profileImage }) => {
  const getFileName = (url) => {
    if (!url) return "Untitled Document";
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  };

  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop();
    return ext ? ext.toLowerCase() : "file";
  };

  const handleOpenFile = () => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch((err) =>
        console.error("Failed to open file", err)
      );
    }
  };

  const fileName = getFileName(fileUrl);
  const fileType = getFileType(fileName);

  return (
    <View style={styles.messageCard}>
      <View style={styles.row}>
        <AvatarComponent
          imageUrl={undefined}
          name={name}
          size={35}
          style={styles.creatorImage}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          {role && <Text style={styles.role}>{role}</Text>}
        </View>
      </View>

      <TouchableOpacity style={styles.documentBox} onPress={handleOpenFile}>
        <View style={styles.documentHeader}>
          <Image
            source={require("../../assets/images/main/pdf.png")}
            style={styles.pdfIcon}
          />
          <Text style={styles.documentTitle} numberOfLines={2}>
            {fileName}
          </Text>
        </View>
        <Text style={styles.documentInfo}></Text>
      </TouchableOpacity>

      <View style={[styles.row, { justifyContent: "flex-end" }]}>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  creatorImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 12,
  },
  messageCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  name: {
    fontWeight: "bold",
    fontFamily: "LatoBold",
    fontSize: 14,
    color: "#26874C",
  },
  role: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "LatoBold",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
    marginRight: 10,
  },
  documentBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginTop: 12,
    padding: 10,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pdfIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  documentTitle: {
    flex: 1,
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "LatoBold",
  },
  documentInfo: {
    fontSize: 12,
    color: "#6c757d",
  },
});

export default DocumentCard;
