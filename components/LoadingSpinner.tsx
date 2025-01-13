import { ActivityIndicator, View, StyleSheet } from "react-native";

export const LoadingSpinner = () => (
    <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
    </View>
);

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});