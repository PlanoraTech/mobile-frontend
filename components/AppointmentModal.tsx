import { Appointment } from "@/types";
import { formatTime } from "@/utils/formatTime";
import { Modal, View, Text, StyleSheet, Pressable, Switch } from "react-native"
import DropdownComponent from "./Dropdown";
import { useState } from "react";
import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";

interface AppointmentModalProps {
    appointment: Appointment;
    onClose: () => void;
}
export const AppointmentModal = ({ appointment, onClose }: AppointmentModalProps) => {
    const {theme} = useTheme(); 
    const themeStyles = getThemeStyles(theme);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <Modal animationType="none" transparent={true} visible={true} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, themeStyles.content]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.subject,{color: theme === 'dark' ? '#fff' : '#333'}]}>Óra beállítások</Text>
                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, {color: theme === 'dark' ? '#fff' : '#333'}]}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.modalMain}>
                        <View style={styles.modalTop}>
                            <View style={[styles.textContainer, styles.card]}>
                                <Text style={[styles.subject, {color: theme === 'dark' ? '#adadad' : '#666'}]}>{appointment.subject.name}</Text>
                                <Text style={[styles.date, {color: theme === 'light' ? '#0066cc' : '#0CAFFF'}]}>{formatTime(appointment.start)} - {formatTime(appointment.end)}</Text>
                            </View>
                            <View style={[styles.cancelContainer, styles.card]}>
                                {isEnabled ? <Text style={styles.cancelTextPostive}>Elmarad</Text> : <Text style={styles.cancelTextNegative}>Megtartva</Text>}
                                <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />


                            </View>
                        </View>
                        <View style={[styles.card, themeStyles.content]}>
                            <DropdownComponent data={appointment.presentators} onSelect={() => { }} label="Előadó" searchPlaceholder="Előadó keresése..." placeholder={appointment.presentators.map(p => p.name).join(', ')} />
                            <DropdownComponent data={appointment.rooms} onSelect={() => { }} label="Terem" searchPlaceholder="Terem keresése..." placeholder={appointment.rooms.map(r => r.name).join(' - ')} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 10,
        width: "80%",
        height: "55%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalMain: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',

    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
    },
    subject: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    date: {
        fontSize: 16,
        textAlign: 'center',
    },
    cancelContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        height: 100,
    },
    cancelTextPostive: {
        fontSize: 16,
        color: '#ff3b30',
        fontWeight: '600',
    },
    cancelTextNegative: {
        fontSize: 16,
        fontWeight: '600',
        color: '#03C03C',
    },
    textContainer: {
        height: 100,
        margin: 16,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    card: {
        padding: 16,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10
    },
})