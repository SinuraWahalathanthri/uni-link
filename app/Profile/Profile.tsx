import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const StudentProfile = () => {
  const student = {
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Vinudhi Wahalathanthri",
    studentId: "UfoTRYgJVOuszd5udS9L",
    email: "vinudhi@example.com",
    degree: "BSc (Hons) in Software Engineering",
    university: "Birmingham City University",
    faculty: "Faculty of Computing and Engineering",
    batch: "2023/2024",
    address: "123 University Road, Colombo, Sri Lanka",
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          alignItems: "center",
          paddingVertical: 30,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <Image
          source={{ uri: student.profilePic }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: "#3D83F5",
            marginBottom: 15,
          }}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
          {student.name}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
          {student.degree}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
            paddingHorizontal: 15,
            paddingVertical: 8,
            backgroundColor: "#3D83F5",
            borderRadius: 20,
          }}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text
            style={{ color: "#fff", fontWeight: "600", marginLeft: 6 }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          padding: 20,
          marginBottom: 20,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
          Student Information
        </Text>

        {[
          { icon: "id-card", label: "Student ID", value: student.studentId },
          { icon: "mail", label: "Email", value: student.email },
          { icon: "school", label: "University", value: student.university },
          { icon: "layers", label: "Faculty", value: student.faculty },
          { icon: "users", label: "Batch", value: student.batch },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Feather
              name={item.icon as any}
              size={20}
              color="#3D83F5"
              style={{ width: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, color: "#777" }}>{item.label}</Text>
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "500" }}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Address Section */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          padding: 20,
          marginBottom: 20,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
          Address
        </Text>
        <Text style={{ fontSize: 16, color: "#333", lineHeight: 22 }}>
          {student.address}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <MaterialIcons name="edit-location-alt" size={20} color="#3D83F5" />
          <Text style={{ color: "#3D83F5", marginLeft: 6, fontWeight: "600" }}>
            Edit Address
          </Text>
        </TouchableOpacity>
      </View>

      {/* Change Password */}
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          elevation: 1,
        }}
      >
        <Ionicons name="lock-closed-outline" size={22} color="#3D83F5" />
        <Text style={{ marginLeft: 10, color: "#3D83F5", fontWeight: "600" }}>
          Change Password
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StudentProfile;
