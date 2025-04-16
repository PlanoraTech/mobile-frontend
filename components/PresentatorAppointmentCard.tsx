import { View, StyleSheet, Pressable } from "react-native"
import { Button, Text, Dialog, Portal, useTheme } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import RoomChangeModal from "./RoomChangeModal"
import { Appointment, SimpleRoomText } from "./AppointmentCard"
import { BASE_URL, SCREEN_WIDTH } from "@/constants"
import { Fragment, useState, useEffect, useMemo } from "react"
import { formatTimeRange } from "@/utils/dateUtils"
import { useMutation } from "@tanstack/react-query"
import { StatusMessage } from "./StatusMessage"
import { useInstitutionId } from "@/contexts/InstitutionIdProvider"
import { useAuth } from "@/contexts/AuthProvider"
import { DropdownItem } from "./Dropdown"
import { useTimetable } from "@/contexts/TimetableProvider"

interface Props {
    appointment: Appointment,
    substitutedPresentators: DropdownItem[],
    setSubstitutedPresentators: React.Dispatch<React.SetStateAction<DropdownItem[]>>,
    presentators: DropdownItem[],
    setPresentators: React.Dispatch<React.SetStateAction<DropdownItem[]>>
}

const PresentatorAppointmentCard = ({
    appointment,
    presentators,
    setPresentators,
    substitutedPresentators,
    setSubstitutedPresentators
}: Props) => {
    const { refetchAppointments } = useTimetable()
    const theme = useTheme()
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isSubstituted, setIsSubstituted] = useState(appointment.presentators.some(p => p.isSubstituted));
    const [optionsNotShown, setOptionsNotShown] = useState(true);
    const [roomChangeModalVisible, setRoomChangeModalVisible] = useState(false);
    const { timetable } = useTimetable()
    const expandProgress = useSharedValue(0);

    const time = formatTimeRange(appointment.start, appointment.end)
    const { user } = useAuth()
    const { institutionId } = useInstitutionId()

    useEffect(() => {
        handlePress();
    }, [])

    const leftCardStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(
                expandProgress.value === 0
                    ? SCREEN_WIDTH - 40
                    : SCREEN_WIDTH / 2 - 40,
                { duration: 400 }
            ),
        };
    });
    const rightCardStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(
                expandProgress.value === 0
                    ? 0
                    : SCREEN_WIDTH / 2 - 40,
                { duration: 400 }
            ),
        };
    });
    const presentatorId = useMemo(() => {
        if (!user) return null;
        if (!user.institutions) return null;
        return user.institutions.find(i => i.institutionId === institutionId)?.presentatorId;
    }, [user, institutionId]);

    const changeSubstitution = useMutation({
        mutationFn: async () => {
            const view = timetable.selectedView === 'timetable' ? 'timetables' : timetable.selectedView;

            const response = await fetch(`${BASE_URL}/${institutionId}/${view}/${timetable.selectedId}/appointments/${appointment.id}/presentators/${presentatorId}/substitute`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ isSubstituted: !isSubstituted }),
            });
            if (!response.ok) {

                if (response.status === 401 || response.status === 403) {
                    throw new Error('Nincs jogosultságod a művelethez!');
                }
                throw new Error('Valami hiba történt a jelenlét megerősítése során!');
            }
        },
        onSuccess: () => {
            setDialogVisible(false);
            if (isSubstituted) {
                setPresentators([...presentators, substitutedPresentators.find(p => p.id === presentatorId)!]);
                setSubstitutedPresentators(substitutedPresentators.filter(p => p.id !== presentatorId));
            } else {
                setSubstitutedPresentators([...substitutedPresentators, presentators.find(p => p.id === presentatorId)!]);
                setPresentators(presentators.filter(p => p.id !== presentatorId));
            }
            setIsSubstituted(!isSubstituted);
            refetchAppointments();
            setOptionsNotShown(true);
        },

    });


    const handleSubstitution = () => {
        changeSubstitution.mutate();
    }

    const openRoomModal = () => {
        setRoomChangeModalVisible(true);
    }

    const closeRoomModal = () => {
        setRoomChangeModalVisible(false);
    }

    const handlePress = () => {
        expandProgress.value = expandProgress.value === 0 ? 1 : 0;
        setOptionsNotShown(!optionsNotShown);
    };

    const isPresentator = appointment.presentators.some(p => p.id === presentatorId);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface },
                    appointment.isCancelled && styles.cancelledCard,
                    leftCardStyle
                ]}
            >
                <Pressable onPress={handlePress}>
                    <Text style={styles.subjectName}>
                        {appointment.subject.name}
                    </Text>
                    <Text style={[styles.timeText]}>
                        {time}
                    </Text>
                    {appointment.presentators.length > 0 &&
                        <Text style={styles.presentatorText}>
                            {[...substitutedPresentators, ...presentators].map((p, index, array) => (
                                <Fragment key={p.id}>
                                    <Text
                                        style={[
                                            styles.presentatorText,
                                            substitutedPresentators.includes(p) && { textDecorationLine: 'line-through' }
                                        ]}
                                    >
                                        {p.name}
                                    </Text>
                                    {index < array.length - 1 && <Text>, </Text>}
                                </Fragment>
                            ))}
                        </Text>

                    }
                    {appointment.rooms.length > 0 && <SimpleRoomText rooms={appointment.rooms} />}
                    {appointment.isCancelled && (
                        <Text style={styles.cancelledText}>ELMARAD</Text>
                    )}
                </Pressable>
            </Animated.View>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>
                        {dialogVisible &&
                            <Text>{isSubstituted ? "Jelenlét" : "Hiányzás"} megerősítése</Text>}

                    </Dialog.Title>
                    <Dialog.Actions>
                        <Button textColor={theme.colors.onSurface} onPress={() => setDialogVisible(false)}>Mégse</Button>
                        <Button mode="contained" onPress={handleSubstitution}>Megerősítés</Button>
                    </Dialog.Actions>
                </Dialog>
                {changeSubstitution.isError && <StatusMessage message={changeSubstitution.error.message || ""} type="error" />}
            </Portal>
            <Animated.View style={[rightCardStyle]}>
                {
                    isPresentator &&
                    <View style={styles.optionCard}>
                        <Button
                            compact
                            buttonColor={isSubstituted ? theme.colors.tertiary : theme.colors.secondary}
                            onPress={() => setDialogVisible(true)}
                            mode="contained" contentStyle={{
                                height: '100%',
                            }}>

                            {isSubstituted ? "Jelen leszek" : "Hiányozni fogok"}

                        </Button>
                    </View>
                }
                <View style={styles.optionCard}>

                    <Button compact onPress={openRoomModal} mode="contained"
                        contentStyle={{
                            height: '100%',
                        }}>
                        Teremcsere
                    </Button>
                </View>
                <RoomChangeModal appointmentId={appointment.id} rooms={appointment.rooms} visible={roomChangeModalVisible} onDismiss={closeRoomModal} />
            </Animated.View>
        </View>

    )
}

export default PresentatorAppointmentCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    cancelledText: {
        color: '#ff3b30',
        fontWeight: '600',
        fontSize: 13,
        marginTop: 5,
    },
    cancelledCard: {
        opacity: 0.7,
    },
    roomText: {
        fontSize: 14,
    },
    presentatorText: {
        fontSize: 14,
        marginBottom: 3,
    },
    card: {
        marginLeft: 10,
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    optionCard: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: 5,
    },
    optionText: {
        color: '#fff',
        fontWeight: 600,
        textAlign: 'center'
    },
    timeText: {
        fontSize: 16,
        color: '#0066cc',
        marginBottom: 5,
        fontWeight: '600',
    },
    subjectName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
});