import { Image } from "expo-image";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AppHeader from "@/components/main/Header";
import AppointmentCard from "@/components/main/AppointmentCard";
import { Link, useNavigation } from "expo-router";
import Lecturers from "@/components/home/Lecturers";
import QuickAccess from "@/components/home/QuickAccess";
import Events from "@/components/home/Events";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {

  const { user } = useAuth();
  const navigation = useNavigation();

  const navigateToSessions = () =>{
    navigation.navigate("Consultations/ConsultationHistory");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === "ios" ? 0 : 36 },
        ]}
      >
        <AppHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 80 : 40,
          }}
        >
          <View style={{ flex: 1 }}>
            <View>
              <Text style={styles.title}>Hi there, {user?.name}!</Text>
              <Text style={styles.subTitle}>Every day is a new beginning.</Text>
            </View>
            <Events />
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
                Upcomming Sessions
              </Text>
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 15,
                  lineHeight: 19,
                  color: "#1A3C7C",
                }}
                onPress={navigateToSessions}
              >
                See all
              </Text>
            </View>

            <View>
              <AppointmentCard />
            </View>

            {/* Quick Access */}
            <QuickAccess />

            {/* Lecturers */}
            <Lecturers />
          </View>
        </ScrollView>
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

  
});
