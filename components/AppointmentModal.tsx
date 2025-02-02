import { Appointment } from "@/types";
import { formatTime } from "@/utils/formatTime";
import { Modal, View, Text, StyleSheet, Pressable, Switch, Animated } from "react-native"
import DropdownComponent from "./Dropdown";
import { useState, useEffect, useRef } from "react";
import { getThemeStyles } from "@/assets/styles/themes";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";

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
    
    const slideAnim = useRef(new Animated.Value(-1000)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {
        if (isVisible) {
            setModalVisible(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 65,
                    friction: 11
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -1000,
                    duration: 250,
                    useNativeDriver: true
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true
                })
            ]).start(() => {
                setModalVisible(false);
            });
        }
    }, [isVisible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -1000,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            onClose();
        });
    };

    if (user?.role !== 'PRESENTATOR') {
        return null;
    }

    return (
        <Modal 
            animationType="none" 
            transparent={true} 
            visible={modalVisible}
            onRequestClose={handleClose}
        >
            <Animated.View 
                style={[
                    styles.modalContainer,
                    {
                        opacity: fadeAnim,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
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
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, themeStyles.text]}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.modalMain}>
                        <View style={styles.modalTop}>
                            <View style={[styles.textContainer, styles.card]}>
                                <Text style={[styles.subject, themeStyles.textSecondary]}>{appointment.subject.name}</Text>
                                <Text style={styles.date}>{formatTime(appointment.start)} - {formatTime(appointment.end)}</Text>
                            </View>

                            <View style={[styles.cancelContainer, styles.card]}>
                                {isEnabled ? 
                                    <Text style={styles.cancelTextPostive}>Elmarad</Text> : 
                                    <Text style={styles.cancelTextNegative}>Megtartva</Text>
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
                        <View style={[styles.card, themeStyles.content]}>
                            <DropdownComponent 
                                data={[
                                    { id: "asd", name: "asd" },
                                    { id: "asd", name: "asd" },
                                    { id: "asd", name: "asd" },
                                    { id: "asd", name: "asd" }
                                ]} 
                                onSelect={() => { }} 
                                searchPlaceholder="Előadó keresése..." 
                                placeholder={appointment.presentators.map(p => p.name).join(', ')} 
                            />
                            <DropdownComponent 
                                data={[
                                    { id: "asd", name: "asd" },
                                    { id: "asd", name: "asd" },
                                    { id: "asd", name: "asd" },
                                    { id: "asd", name: "asd" }
                                ]} 
                                onSelect={() => { }} 
                                searchPlaceholder="Terem keresése..." 
                                placeholder={appointment.rooms.map(r => r.name).join(' - ')} 
                            />
                        </View>
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
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 0
    },
});