import { AuthProvider } from "@/contexts/AuthProvider";
import { Stack } from "expo-router";
import { StandardAuthAdapter } from "@/contexts/StandardAuthAdapter";
import { InstitutionIdProvider } from "@/contexts/InstitutionIdProvider";
import { ThemeProviderLocal, useTheme } from "@/contexts/ThemeProvider";
import * as SystemUI from "expo-system-ui";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from 'react-native-paper';
import { useCombinedTheme } from "@/hooks/useCombinedTheme";



const authAdapter = new StandardAuthAdapter();
const StackNavigator = () => {
  const { theme } = useTheme();

  //needed for keyboard appearance
  theme === "dark" ? SystemUI.setBackgroundColorAsync("#1a1a1a") : SystemUI.setBackgroundColorAsync("#f5f5f5");

  const { paperTheme } = useCombinedTheme(theme)

  return (
    // needed for background during animation
    <ThemeProvider value={
      theme === "dark" ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: "transparent",
        }
      } : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "transparent",
        }
      }
    }>

      <InstitutionIdProvider>
        <GestureHandlerRootView>
          <PaperProvider theme={paperTheme}>

            <Stack>
              <Stack.Screen name="(tabs)" options={{
                headerShown: false,
              }} />
            </Stack>
          </PaperProvider>
        </GestureHandlerRootView>
      </InstitutionIdProvider>
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
