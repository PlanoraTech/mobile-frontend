import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { JWTAuthAdapter } from "@/contexts/JWTAuthAdapter";
import { InstitutionProvider } from "@/contexts/InstitutionProvider";
import { ThemeProvider, useTheme } from "@/contexts/ThemeProvider";
import * as SystemUI from "expo-system-ui";


const authAdapter = new JWTAuthAdapter();
const StackNavigator = () => {
  const { theme } = useTheme();
  theme === "dark" ? SystemUI.setBackgroundColorAsync("#121212") : SystemUI.setBackgroundColorAsync("#f5f5f5");
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <InstitutionProvider>
      <AuthProvider authAdapter={authAdapter}>
        <ThemeProvider>
          
         <StackNavigator />
          
        </ThemeProvider>
      </AuthProvider>
    </InstitutionProvider>
  );
}
