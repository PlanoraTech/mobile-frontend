import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";

export const LoadingSpinner = () => {
    const { theme } = useTheme();
    const themeStyles = getThemeStyles(theme);
    return (
        <View style={[styles.centerContainer, themeStyles.content]}>
            <ActivityIndicator size="large" color={themeStyles.textSecondary.color} />
        </View>
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});