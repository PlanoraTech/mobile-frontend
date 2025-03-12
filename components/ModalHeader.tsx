import { View, Text, Pressable, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper";

interface ModalHeaderProps {
    title: string;
    handleClose?: () => void;
}

const ModalHeader = ({ title, handleClose }: ModalHeaderProps) => {
    const theme = useTheme();
    return (
        <View style={[styles.modalHeader, { borderColor: theme.colors.outline }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                {title}
            </Text>
            {handleClose &&
                <Pressable
                    onPress={handleClose}
                    style={styles.closeButton}
                >
                    <Text style={[styles.closeButtonText, { color: theme.colors.onSurface }]}>×</Text>
                </Pressable>
            }
        </View>
    );
}

export default ModalHeader;

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 20,
    },
});

