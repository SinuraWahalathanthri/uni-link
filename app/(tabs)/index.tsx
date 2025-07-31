import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";

import AppHeader from "@/components/main/Header";
import { useNavigation } from "expo-router";
import Lecturers from "@/components/home/Lecturers";
import QuickAccess from "@/components/home/QuickAccess";
import Events from "@/components/home/Events";
import { useAuth } from "@/context/AuthContext";
import { isToday } from "date-fns";
import { getLecturer, getYourConsultations } from "@/services/StorageServices";
import ConsultationCard from "../Consultations/Card";
import AppointmentCard from "@/components/main/AppointmentCard";
import Announcements from "@/components/home/Announcements";

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [todayConsultations, setTodayConsultations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTodayConsultations = async () => {
    if (!user?.id) return;

    try {
      const data = await getYourConsultations(user.id);
      const withLecturers = await Promise.all(
        data.map(async (c) => {
          try {
            const lecturer = await getLecturer(c.lecturer_id);
            return { ...c, lecturer };
          } catch (error) {
            console.warn("Failed to fetch lecturer for consultation:", c.id);
            return { ...c, lecturer: null };
          }
        })
      );

      const todays = withLecturers.filter((c) => {
        const status = c.status?.toLowerCase();
        const isValidStatus = status === "accepted" || status === "started";
        const isScheduledToday =
          c.scheduledDateTime?.toDate && isToday(c.scheduledDateTime.toDate());

        return isValidStatus && isScheduledToday;
      });

      const latestAppointment = todays.sort(
        (a, b) => b.scheduledDateTime.toDate() - a.scheduledDateTime.toDate()
      )[0];

      setTodayConsultations(latestAppointment ? [latestAppointment] : []);
    } catch (error) {
      console.error("Failed to fetch consultations", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayConsultations();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTodayConsultations();
  }, [user]);

  const navigateToSessions = () => {
    navigation.navigate("Consultations/ConsultationHistory");
  };

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
                Upcoming Sessions
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
            {todayConsultations.length > 0 ? (
              todayConsultations.map((consult, index) => (
                <View key={consult.id || index} style={{ marginTop: 16 }}>
                  <AppointmentCard item={consult} />
                </View>
              ))
            ) : (
              <Text style={styles.subTitle}>No Appointment Today</Text>
            )}

            {/* Quick Access */}
            {/* <QuickAccess /> */}

            {/* Lecturers */}
            {/* <Lecturers /> */}
            <Announcements/>
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
