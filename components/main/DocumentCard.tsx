import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const DocumentCard = () => {
  return (
    <View style={styles.messageCard}>
      <View style={styles.row}>
        <Image
          source={require("../../assets/images/profileImage.png")}
          style={styles.creatorImage}
        />
        <View>
          <Text style={styles.name}>Michael Chen</Text>
          <Text style={styles.role}>Lecturer • Mathematics</Text>
        </View>
      </View>

      <Image
        source={require("../../assets/images/main/hack-1.png")} 
        style={styles.mainImage}
      />
      <View style={styles.documentBox}>
        <View style={styles.documentHeader}>
          <Image
            source={require("../../assets/images/main/pdf.png")} 
            style={styles.pdfIcon}
          />
          <Text style={styles.documentTitle}>
            Introduction to Software Design and Analysis - The basic
            Fundamentals - Conducted by Prof. Michael Chen
          </Text>
        </View>
        <Text style={styles.documentInfo}>5 pages • 227 KB • pdf</Text>
      </View>
       <View style={[styles.row,{justifyContent:"space-between"}]}>
        <Text></Text>
        <Text> </Text>
        <Text style={styles.time}>2:00 PM</Text>
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
  messageText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Lato",
    lineHeight: 23,
    marginTop: 10,
    padding: 5,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
    marginRight:10,
  },
  likeBar: {
    backgroundColor: "#fafafa",
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    position: "absolute",
  },
  pdfCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 2,
  },
  pdfImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  pdfTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  pdfDetails: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  mainImage: {
    width: "100%",
    height: 100,
    borderTopEndRadius: 10,
    borderTopLeftRadius:10,
    marginVertical: 10,
  },
  documentBox: {
    backgroundColor: "#f8f9fa",
    borderBottomEndRadius: 10,
    borderBottomLeftRadius:10,
    marginTop:-10,
    padding: 10,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  pdfIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
    marginTop: 4,
  },
  documentTitle: {
    flex: 1,
    fontWeight: "500",
    fontSize: 13,
  },
  documentInfo: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  reaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    marginLeft: 4,
    color: "#333",
    fontSize: 13,
  },
});

export default DocumentCard;
