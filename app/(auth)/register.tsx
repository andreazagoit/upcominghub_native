import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {TextInput} from "@/components/ui/text-input";
import {useAuth} from "@/hooks/use-auth";
import {router} from "expo-router";
import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const {register} = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Sending registration request:", {username, email, password});

      const result = await register(email, password, username);

      if (result.success) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate to main app
              router.replace("/(main)/explore");
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-black"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        className="flex-1"
        contentContainerClassName="flex-1 px-6 py-8 justify-center"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-12">
          <Text variant="title" className="mb-2">Create Account</Text>
          <Text className="text-center text-zinc-600 dark:text-zinc-400">
            Sign up to get started
          </Text>
        </View>

        <View className="gap-5">
          <TextInput
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            onPress={handleRegister}
            loading={loading}
            className="mt-2"
          >
            Create Account
          </Button>
        </View>

        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
          </Text>
          <Button
            variant="ghost"
            onPress={handleLoginPress}
            className="px-0 py-0 min-h-0"
          >
            Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
