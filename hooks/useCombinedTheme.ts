import { darkTheme, getThemeStyles, lightTheme, ThemeColors, ThemeMode } from '@/assets/styles/themes';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';


function createPaperTheme(customTheme: ThemeColors, baseTheme: typeof MD3LightTheme) {
    return {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
         
            primary: customTheme.button.primary,
            secondary: customTheme.button.secondary,
            tertiary: customTheme.button.tertiary,
            onPrimary: '#fff',

            background: customTheme.background,
            surface: customTheme.contentBackground,

     
            onSurface: customTheme.text.secondary,
            onSurfaceVariant: customTheme.text.secondary,

          
            outline: customTheme.border,
            surfaceDisabled: customTheme.inputBackground,
            elevation: {
                level3: customTheme.contentBackground
            }
    
        },
      
        dark: baseTheme.dark,
        roundness: 2,
    };
}


export function useCombinedTheme(themeMode: ThemeMode) {
    const customTheme = themeMode === 'light' ? lightTheme : darkTheme;
    const baseTheme = themeMode === 'light' ? MD3LightTheme : MD3DarkTheme;

    return {
        paperTheme: createPaperTheme(customTheme, baseTheme),
        customStyles: getThemeStyles(themeMode),
    };
}