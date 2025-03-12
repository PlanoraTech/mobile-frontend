import { View, Text, StyleSheet } from "react-native"
import { useTheme, IconButton } from "react-native-paper";

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
                <IconButton
                    icon="close"
                    size={24}
                    onPress={handleClose}
                    iconColor={theme.colors.onSurface}
                />
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
    }
});

