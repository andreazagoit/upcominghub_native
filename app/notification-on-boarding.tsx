import {router} from "expo-router";
import React from "react";
import {Pressable, StyleSheet, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const NotificationOnBoardingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Stay Connected with Push Notifications</Text>
      <Text style={styles.description}>
        We&apos;ll send you a notification when you have a new message.
      </Text>
      <Pressable
        style={({pressed}) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
        onPress={() => {}}
      >
        <Text style={styles.primaryButtonText}>Allow Notifications</Text>
      </Pressable>

      <Pressable
        style={({pressed}) => [
          styles.secondaryButton,
          pressed && styles.secondaryButtonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryButtonText}>Ask Me Later</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonPressed: {
    backgroundColor: "#333333",
    opacity: 0.8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 15,
  },
  secondaryButtonPressed: {
    backgroundColor: "#f1f5f9",
    opacity: 0.7,
  },
  secondaryButtonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default NotificationOnBoardingScreen;
