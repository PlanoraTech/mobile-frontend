import { Theme } from "@react-navigation/native";

interface ThemeProdiverContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}