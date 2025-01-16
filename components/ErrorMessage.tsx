import { View, Text, StyleSheet} from "react-native";

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({message}: ErrorMessageProps) => (
    <View style={styles.centerContainer}>
        <Text style={styles.error}>{message}</Text>
    </View>
);

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