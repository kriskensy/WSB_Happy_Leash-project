import { Stack, useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScrean from "../components/SafeScrean";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

function AdminProtection({ children }) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const isAdminRoute = segments[0] === "(admin)";
      if (!isAdminRoute) return;

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "Admin") {
          router.replace("/");
        }
      } catch (error) {
        console.error("Błąd weryfikacji tokena:", error);
        router.replace("/(auth)/login");
      }
    };

    checkAdminAccess();
  }, [segments]);

  return children;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeScrean>
        <AdminProtection>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </AdminProtection>
      </SafeScrean>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
