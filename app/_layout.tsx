import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { JWTAuthAdapter } from "@/contexts/JWTAuthAdapter";
import { InstitutionProvider } from "@/contexts/InstitutionProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";

const authAdapter = new JWTAuthAdapter();

export default function RootLayout() {
  return <InstitutionProvider>
  <AuthProvider authAdapter={authAdapter}>
    <ThemeProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/login" options={{ title: "Bejelentkezés" }} />
      <Stack.Screen name="screens/register" options={{ title: "Regisztráció" }} />
    </Stack>
    </ThemeProvider>
  </AuthProvider>
  </InstitutionProvider>
}
