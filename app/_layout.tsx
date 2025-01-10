import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { JWTAuthAdapter } from "@/contexts/JWTAuthAdapter";
import { InstitutionProvider } from "@/contexts/InstitutionProvider";

const authAdapter = new JWTAuthAdapter();

export default function RootLayout() {
  return <InstitutionProvider>
  <AuthProvider authAdapter={authAdapter}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  </AuthProvider>
  </InstitutionProvider>
}
