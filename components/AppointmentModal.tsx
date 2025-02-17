import { Appointment } from "@/components/AppointmentCard";
import { formatTime, formatTimeRange } from "@/utils/dateUtils";
import { Modal, View, Text, StyleSheet, Pressable, Switch, Animated, Platform } from "react-native"
import DropdownComponent from "./Dropdown";
import { useState, useEffect, useRef } from "react";
import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";

import { useAuth } from "@/contexts/AuthProvider";
import { BASE_URL } from "@/constants";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
import { runCloseAnimation, runOpenAnimation } from "@/utils/animationUtils";

interface AppointmentModalProps {
    appointment: Appointment;
    isVisible: boolean;
    onClose: () => void;
}

export const AppointmentModal = ({ isVisible, appointment, onClose }: AppointmentModalProps) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const themeStyles = getThemeStyles(theme);
    const [isEnabled, setIsEnabled] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [presentators, setPresentators] = useState([]);
    const [rooms, setRooms] = useState([]);
    const slideAnim = useRef(new Animated.Value(-1000)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const { institutionId } = useInstitutionId();

    useEffect(() => {
        if (isVisible) {
            runOpenAnimation(slideAnim, fadeAnim);
            setModalVisible(true);
        } else {
            runCloseAnimation(slideAnim, fadeAnim, () => {
                setModalVisible(false);
            });

        }

    }, [isVisible]);

    useEffect(() => {
        fetchPresentators();
        fetchRooms();
    }, []);

    const fetchPresentators = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${institutionId}/presentators`);
            const presentatorsData = await response.json();
            setPresentators(presentatorsData);

        } catch (error) {
            console.error(error);
        }

    }


    const fetchRooms = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${institutionId}/rooms`);
            const roomsData = await response.json();
            setRooms(roomsData);
        } catch (error) {
            console.error(error);
        }
    }



    if (user?.role !== 'PRESENTATOR' && user?.role !== 'DIRECTOR') {
        return null;
    }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
        >
            <Animated.View

                style={[
                    styles.modalContainer,
                    {
                        opacity: fadeAnim,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    Platform.OS === 'ios' ? { paddingTop: 50 } : { paddingTop: 0 }
                ]}
            >
                <Animated.View
                    style={[
                        styles.modalContent,
                        themeStyles.content,
                        {
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={[styles.modalHeader, themeStyles.border]}>
                        <Text style={[styles.subject, themeStyles.text]}>Óra beállítások</Text>
                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >

                            <Text style={[styles.closeButtonText, themeStyles.text]}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.modalMain}>
                        <View style={[styles.card]}>
                        
                            <DropdownComponent
                                data={rooms}
                                onSelect={() => { }}

                                searchPlaceholder="Terem keresése..."
                                placeholder={appointment.rooms.map(r => r.name).join(' - ')}
                            />
                            <View style={styles.modalTop}>
                                <View style={[styles.textContainer, styles.card]}>
                                    <Text style={[styles.subject, themeStyles.textSecondary]}>{appointment.subject.name}</Text>
                                    <Text style={styles.date}>{formatTimeRange(appointment.start, appointment.end)}</Text>
                                </View>

                                <View style={[styles.cancelContainer, styles.card]}>
                                    {isEnabled ?
                                        <Text style={styles.cancelTextPostive}>Hiányzás</Text> :
                                        <Text style={styles.cancelTextNegative}>Jelenlét</Text>
                                    }
                                    <Switch
                                        trackColor={{
                                            false: themeStyles.switch.track,
                                            true: themeStyles.switch.trackActive
                                        }}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                                </View>
                            </View>
                        </View>

                        <Pressable style={[styles.modalButton, themeStyles.button]}>
                            <Text style={styles.modalButtonText}>Mentés</Text>
                        </Pressable>

                    </View>
                </Animated.View>

            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    modalTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalMain: {
        padding: 16,
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
        fontWeight: '600',
        color: '#0066cc',
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
    },
    modalButton: {
        padding: 16,
        borderRadius: 15,

        marginTop: 16,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});