import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { JWTAuthAdapter } from "@/contexts/JWTAuthAdapter";

const authAdapter = new JWTAuthAdapter();

export default function RootLayout() {
  return <Stack>
    <AuthProvider authAdapter={authAdapter}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </AuthProvider>
  </Stack>;
}
