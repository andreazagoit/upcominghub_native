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
  StyleSheet,
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Bentornato</Text>
            <Text variant="secondary" style={styles.subtitle}>
              Accedi al tuo account Upcoming Hub
            </Text>
          </View>

          <View style={styles.form}>
            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
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
              style={styles.loginButton}
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="secondary" style={styles.footerText}>
              Non hai ancora un account?{" "}
            </Text>
            <Button
              variant="ghost"
              onPress={handleRegisterPress}
              style={styles.registerButton}
              disabled={loading}
            >
              Registrati
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Will be themed
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    lineHeight: 20,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
  registerButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: "auto",
  },
});

export default LoginScreen;
