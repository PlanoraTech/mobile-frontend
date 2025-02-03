import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { StandardAuthAdapter } from "@/contexts/StandardAuthAdapter";
import { InstitutionProvider } from "@/contexts/InstitutionProvider";
import { ThemeProviderLocal, useTheme } from "@/contexts/ThemeProvider";
import * as SystemUI from "expo-system-ui";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";



const authAdapter = new StandardAuthAdapter();
const StackNavigator = () => {
  const { theme } = useTheme();

  //needed for keyboard appearance
  theme === "dark" ? SystemUI.setBackgroundColorAsync("#121212") : SystemUI.setBackgroundColorAsync("#f5f5f5");
  
  return (
    // needed for background during animation
    <ThemeProvider value={
      theme === "dark" ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: "#121212",
        }
      } : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "#f5f5f5",
        }
      }
    }>

    <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerShown: false,
      }} />
    </Stack>
    </ThemeProvider>

  )
}
export default function RootLayout() {
  return (


        <AuthProvider authAdapter={authAdapter}>
          <ThemeProviderLocal>
            <StackNavigator />

          </ThemeProviderLocal>
        </AuthProvider>

 

  );
}
