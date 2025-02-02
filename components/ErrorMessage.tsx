import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { View, Text, StyleSheet} from "react-native";


interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({message}: ErrorMessageProps) => {
    const {theme} = useTheme();
    const themeStyles = getThemeStyles(theme);
    return <View style={[styles.centerContainer, themeStyles.content]}>
        <Text style={styles.error}>{message}</Text>
    </View>

};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16
    },
});