import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PanResponder,
  Easing,
} from "react-native";
import Step1 from "./Booking-Step1";
import Step2 from "./Booking-Step2";
import Step3 from "./Booking-Step3";

export default function BookingProcess() {
  const [currentPage, setCurrentPage] = useState(1);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [showBookingMessage, setShowBookingMessage] = useState(false);
  const bookingAnim = useRef(new Animated.Value(0)).current;

  const isNextDisabled = false;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50 && currentPage > 1) {
          handleBack();
        } else if (gestureState.dx < -50 && currentPage < 3) {
          handleNext();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (currentPage < 3) setCurrentPage(currentPage + 1);
    else {
      Animated.timing(bookingAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const segmentWidth = 300 / 3;
    Animated.timing(progressAnim, {
      toValue: segmentWidth * (currentPage - 1),
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentPage]);

  const renderContent = () => {
    if (currentPage === 1) {
      return (
       <>
       <Step1/>
       </>
      );
    } else if (currentPage === 2) {
      return (
       <>
       <Step2/>
       </>
      );
    } else if (currentPage === 3) {
      return (
       <>
       <Step3/>
       </>
      );
    }
  };

  const renderPageIndicator = () => {
    const segmentWidth = 100 / 3;

    return (
      <View style={styles.pageIndicatorContainer}>
        <View style={styles.pageIndicatorBackground} />
        <Animated.View
          style={[
            styles.pageIndicatorSegment,
            {
              width: `${segmentWidth}%`,
              transform: [
                {
                  translateX: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 100],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <StepsNavigation onPress={handleBack} /> */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container2}>
        <View style={{ marginTop: 0 }} />
        <ScrollView
          {...panResponder.panHandlers}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {renderContent()}
        </ScrollView>
      </View>
      <View style={styles.container3}>
        <Animated.View
          style={{
            width: "95%",
            position: "absolute",
            backgroundColor: "#3b3936",
            padding: 5,
            bottom: bookingAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 45], // Moves from hidden to visible
            }),
            left: 16,
            borderRadius: 100,
            zIndex: 100,
            opacity: bookingAnim,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontFamily: "CanelaRegular",
              textAlign: "center",
              padding: 12,
            }}
          >
            You have a booking with a mentor at this time
          </Text>
        </Animated.View>
        {renderPageIndicator()}
        <View style={{ padding: 10, marginLeft: "auto" }}>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                isNextDisabled && { backgroundColor: "#d8d8d8" },
              ]}
              onPress={handleNext}
              disabled={isNextDisabled}
            >
              <Text
                style={[styles.buttonText, isNextDisabled && { color: "grey" }]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  pageIndicatorContainer: {
    height: 5,
    marginVertical: 5,
    position: "relative",
    backgroundColor: "transparent",
  },
  pageIndicatorBackground: {
    width: "100%",
    height: 5,
    borderRadius: 10,
    backgroundColor: "#efece8",
    position: "absolute",
  },
  pageIndicatorSegment: {
    height: 11,
    marginTop: -4,
    borderRadius: 10,
    backgroundColor: "#c5ab87",
    position: "absolute",
    borderWidth: 3,
    borderColor: "white",
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
    // padding: 16,
  },
  container3: {
    justifyContent: "flex-end",
    backgroundColor: "white",
    marginBottom: -10,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    minWidth: 120,
    backgroundColor: "#c5ab87",
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  backButton: {
    minWidth: 120,
    backgroundColor: "#d1c5b0",
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "CanelaRegular",
    marginTop: 5,
  },
});
