import {Text} from "@/components/ui/text";
import {useAuth} from "@/hooks/use-auth-zustand";
import {router} from "expo-router";
import React from "react";
import {Alert, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const AccountScreen = () => {
  const {user, logout} = useAuth();

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
          </View>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text variant="secondary" style={styles.userEmail}>
            {user?.email || "No email"}
          </Text>
          {user?.role && (
            <Text variant="muted" style={styles.userRole}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text variant="secondary" style={styles.statLabel}>
              Events
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text variant="secondary" style={styles.statLabel}>
              Following
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text variant="secondary" style={styles.statLabel}>
              Groups
            </Text>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>User Information</Text>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>User ID</Text>
            <Text variant="secondary" style={styles.menuItemValue}>
              {user?.id || "N/A"}
            </Text>
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Email Verified</Text>
            <Text variant="secondary" style={styles.menuItemValue}>
              {user?.emailVerified ? "Yes" : "No"}
            </Text>
          </View>

          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Account Type</Text>
            <Text variant="secondary" style={styles.menuItemValue}>
              {user?.type || "N/A"}
            </Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Personal Information</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Settings</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notification Preferences</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Language</Text>
            <Text variant="secondary">English</Text>
          </Pressable>
        </View>

        {/* App Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>App</Text>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>About</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text variant="muted">{">"}</Text>
          </Pressable>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e2e8f0",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  userRole: {
    fontSize: 14,
    marginTop: 4,
    textTransform: "capitalize",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 16,
    marginHorizontal: -10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemValue: {
    fontSize: 14,
    maxWidth: 200,
    textAlign: "right",
  },
  logoutSection: {
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountScreen;
