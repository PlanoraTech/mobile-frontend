import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { JWTAuthAdapter } from "@/contexts/JWTAuthAdapter";
import { InstitutionProvider } from "@/contexts/InstitutionProvider";
import { ThemeProvider, useTheme } from "@/contexts/ThemeProvider";

const authAdapter = new JWTAuthAdapter();

function StackNavigator() {
  const { theme } = useTheme();
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/login" options={
      {
      title: "Bejelentkezés",
      headerStyle: {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      },
      headerTintColor: theme === 'dark' ? '#767577' : '#666',
      headerShadowVisible: false
      }
      } />
      <Stack.Screen name="screens/register" options={
      { 
      title: '',
      headerStyle: {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      },
      headerTintColor: theme === 'dark' ? '#767577' : '#666',
      headerShadowVisible: false,
      }
      } />
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
