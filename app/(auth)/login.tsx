import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {TextInput} from "@/components/ui/text-input";
import {useAuth} from "@/hooks/use-auth";
import {router} from "expo-router";
import React, {useState} from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const {signIn} = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = "L'email è richiesta";
    } else if (!validateEmail(email)) {
      newErrors.email = "Inserisci un'email valida";
    }

    if (!password.trim()) {
      newErrors.password = "La password è richiesta";
    } else if (password.length < 6) {
      newErrors.password = "La password deve essere di almeno 6 caratteri";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Reset previous errors
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success && result.user) {
        // Login successful, navigation will be handled by auth state
        console.log("✅ Login successful");
      } else {
        // Handle specific error codes
        if (result.message?.includes("EMAIL_NOT_VERIFIED")) {
          setErrors({
            general:
              "Per favore verifica la tua email prima di accedere. Controlla la tua casella di posta per il link di verifica.",
          });
          Alert.alert(
            "Email non verificata",
            "Per favore verifica la tua email prima di accedere. Controlla la tua casella di posta per il link di verifica.",
            [{text: "OK"}]
          );
        } else if (result.message?.includes("SLUG_NOT_SET")) {
          setErrors({
            general:
              "Per favore imposta il tuo username prima di accedere. Sarai reindirizzato alla pagina di configurazione.",
          });
          Alert.alert(
            "Username non impostato",
            "Per favore imposta il tuo username prima di accedere.",
            [{text: "OK"}]
          );
          // TODO: Navigate to slug setup page when available
        } else if (result.message?.includes("INVALID_CREDENTIALS")) {
          setErrors({
            general: "Email o password non valide. Riprova.",
          });
        } else {
          setErrors({
            general: result.message || "Login fallito. Riprova.",
          });
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrors({
        general: "Si è verificato un errore durante il login. Riprova.",
      });
      Alert.alert(
        "Errore",
        "Si è verificato un errore durante il login. Verifica la tua connessione e riprova."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    router.push("/(auth)/register");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-black"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 py-8 justify-center">
          <View className="items-center mb-12">
            <Text variant="title" className="mb-2">Bentornato</Text>
            <Text className="text-center text-zinc-600 dark:text-zinc-400">
              Accedi al tuo account Upcoming Hub
            </Text>
          </View>

          <View className="gap-5">
            {errors.general && (
              <View className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3 mb-1">
                <Text className="text-red-600 dark:text-red-400 text-sm leading-5">{errors.general}</Text>
              </View>
            )}

            <TextInput
              label="Email"
              placeholder="Inserisci la tua email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // Clear errors when user starts typing
                if (errors.email || errors.general) {
                  setErrors((prev) => ({
                    ...prev,
                    email: undefined,
                    general: undefined,
                  }));
                }
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TextInput
              label="Password"
              placeholder="Inserisci la tua password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                // Clear errors when user starts typing
                if (errors.password || errors.general) {
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                    general: undefined,
                  }));
                }
              }}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Button
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              className="mt-2"
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </View>

          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-zinc-600 dark:text-zinc-400">
              Non hai ancora un account?{" "}
            </Text>
            <Button
              variant="ghost"
              onPress={handleRegisterPress}
              disabled={loading}
              className="px-0 py-0 min-h-0"
            >
              Registrati
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
