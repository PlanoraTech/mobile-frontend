import { useTheme } from "@/contexts/ThemeProvider";
import { View, Text, StyleSheet} from "react-native";

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({message}: ErrorMessageProps) => {
    const {theme} = useTheme();
    return <View style={[styles.centerContainer, {backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5'}]}>
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
        fontSize: 18
    },
});