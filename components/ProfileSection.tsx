
import { View, StyleSheet } from "react-native";
import { Icon, IconButton, Text, TouchableRipple } from "react-native-paper";

interface Props {
    icon: string;
    label: string;
    actionIcon?: string;
    onPress?: () => void;
    disabled?: boolean;
    text?: string;
}

const ProfileSection = ({ label, icon, actionIcon, onPress, disabled, text }: Props) => {
    return (
        <TouchableRipple onPress={!disabled ? onPress : () => { }} rippleColor="rgba(0, 0, 0, 0.32)" style={styles.section}>
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source={icon} size={24} />
                    <Text style={styles.label} >{label}</Text>
                </View>
                {text ? <Text style={styles.label}>{text}</Text> :
                    <IconButton icon={actionIcon!} size={20} onPress={onPress} disabled={disabled} />
                }
            </>
        </TouchableRipple>
    )
}

export default ProfileSection;

const styles = StyleSheet.create({
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        height: 60,
        marginBottom: 0
    },
    label: {
        fontSize: 16,
        marginLeft: 10
    }
});