import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler
} from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent, { DropdownItem } from '@/components/Dropdown';
import { router } from 'expo-router';
import { saveId } from '@/utils/saveId';
import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusMessage } from './StatusMessage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    Easing
} from 'react-native-reanimated';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import ModalHeader from './ModalHeader';
import { BASE_URL, TAB_CONFIG } from '@/constants';
import { InstitutionData } from '@/hooks/useInstitutionData';
import { useTimetable } from '@/contexts/TimetableProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    loading: boolean;
    institutions: DropdownItem[];
    institution: InstitutionData | null;
    onSelect: () => void;
}

export const SettingsModal = ({
    visible,
    onClose,
    institutions,
    loading,
    institution,
    onSelect,
}: SettingsModalProps) => {
    const theme = useTheme();
    const { user } = useAuth();
    const { institutionId, setInstitutionId } = useInstitutionId();
    const { timetable, setTimetableSelection } = useTimetable();
    const slideAnim = useSharedValue(-1000);
    const fadeAnim = useSharedValue(0);
    const displayValue = useSharedValue(0);

    const [selectedPlaceholder, setSelectedPlaceholder] = useState<Record<number, string>>({
        0: '',
        1: '',
        2: ''
    });
    const [currentBtnIndex, setCurrentBtnIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const segmentedButtonOptions = TAB_CONFIG.map((tab, index) => ({
        value: tab.value,
        label: tab.label,
        accessibilityLabel: tab.accessibilityLabel,
        icon: tab.icon,
        checkedColor: '#fff',
        style: {
            backgroundColor: currentBtnIndex === index ? theme.colors.primary : theme.colors.surface,
        },
    }));

    const queryClient = useQueryClient();
    const handleDropdownSelect = (item: DropdownItem, type: string) => {
        queryClient.invalidateQueries({ queryKey: ['timetable'] });
        onSelect();
        setTimetableSelection(type.toLowerCase(), item.id);
        setSelectedPlaceholder({
            ...selectedPlaceholder,
            [currentBtnIndex]: item.name,
        });
    };

    const slideAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: slideAnim.value }]
    }));

    const fadeAnimStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        paddingTop: Platform.OS === 'ios' ? 0 : 24,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: displayValue.value === 0 ? 'none' : 'flex',
    }));

    const runOpenAnimation = useCallback(() => {
        displayValue.value = 1;
        slideAnim.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.cubic)
        });
        fadeAnim.value = withTiming(1, {
            duration: 250,
            easing: Easing.linear
        });
    }, [slideAnim, fadeAnim, displayValue]);

    const runCloseAnimation = useCallback((afterClose?: () => void) => {
        slideAnim.value = withTiming(-1000, {
            duration: 250,
            easing: Easing.in(Easing.cubic)
        });
        fadeAnim.value = withTiming(0, {
            duration: 200,
            easing: Easing.linear
        }, () => {

            displayValue.value = 0;
            if (afterClose) runOnJS(afterClose)();
        });
    }, [slideAnim, fadeAnim, displayValue]);

    const { data, isError } = useQuery({
        queryKey: ['placeholder'],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/${institutionId}/${timetable.selectedView}/${timetable.selectedId}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            })
            return response.json();
        },
    });

    useEffect(() => {
        if (data && !isError) {
          let newBtnIndex;
          
          switch (timetable.selectedView) {
            case 'presentators':
              newBtnIndex = 1;
              break;
            case 'rooms':
              newBtnIndex = 2;
              break;
            case 'timetables':
              newBtnIndex = 0;
          }
          
          if (newBtnIndex !== undefined) {
            setCurrentBtnIndex(newBtnIndex);
            setSelectedPlaceholder({
              ...selectedPlaceholder,
              [newBtnIndex]: data.name, 
            });
          }
        }
      }, [data]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (visible) {
                handleClose();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [visible]);

    useEffect(() => {
        if (visible) {
            runOpenAnimation();
        } else {
            runCloseAnimation();
        }
    }, [visible, runOpenAnimation, runCloseAnimation]);

    const handleClose = () => {
        runCloseAnimation(() => {
            onClose();
        });
    }
    const handleInstSelect = (item: DropdownItem) => {
        const isUserLoggedIn = () => !!user;

        const hasInstitutionAccess = (institutionId: string) => {
            return user?.institutions.some(
                (instId: { institutionId: string }) => instId.institutionId === institutionId
            );
        };

        const handleAuthorizationFailure = (reason: 'login_required' | 'access_denied') => {
            handleClose();
            if (reason === 'login_required') {
                router.replace('/login' as any);
            } else {
                setErrorMessage('Nincs hozzáférésed ehhez az intézményhez');
            }
            return false;
        };

        const checkAuthorization = () => {
            if (item.access !== 'PRIVATE') {
                return true;
            }

            if (!isUserLoggedIn()) {
                return handleAuthorizationFailure('login_required');
            }

            if (!hasInstitutionAccess(item.id)) {
                return handleAuthorizationFailure('access_denied');
            }

            return true;
        };

        if (!checkAuthorization()) {
            return;
        }


        if (item.id !== institutionId) {
            saveId('institution', item.id);
            AsyncStorage.removeItem('timetable');
            setInstitutionId(item.id);
            setTimetableSelection(TAB_CONFIG[currentBtnIndex].value.toLowerCase(), '');
        }
    }

    const orderedInstitutions = useMemo(() => {
        if (!institutions) return [];
        return [...institutions].sort((a) =>
            user?.institutions.some((inst: { institutionId: string }) => inst.institutionId === a.id) ? -1 : 1
        );

    }, [institutions, user?.institutions]
    );


    if (!visible && displayValue.value === 0) {
        return null;
    }

    const renderTabContent = () => {
        const currentTab = TAB_CONFIG[currentBtnIndex];

        const dataMap = {
            presentators: institution?.presentators,
            timetables: institution?.timetables,
            rooms: institution?.rooms
        };

        const itemsData = dataMap[currentTab.dataKey as keyof typeof dataMap] ?? [];
        const placeholderText = selectedPlaceholder[currentBtnIndex] || currentTab.placeholder;
        return (
            <View style={styles.card}>
                <DropdownComponent
                    data={itemsData}
                    placeholder={placeholderText}
                    searchPlaceholder={currentTab.searchPlaceholder}
                    onSelect={(item) => handleDropdownSelect(item, currentTab.type)}
                />
            </View>
        );
    };

    return (
        <Animated.View style={fadeAnimStyle}>
            <TouchableOpacity
                testID="settings-modal"
                onPress={handleClose}
                activeOpacity={1}
                style={styles.modalContainer}
            >
                <TouchableWithoutFeedback>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            { backgroundColor: theme.colors.surface },
                            slideAnimStyle,
                        ]}
                    >
                        <ModalHeader title="Beállítások" handleClose={handleClose} />
                        {loading ? (<LoadingSpinner />)
                            : (
                                <ScrollView>
                                    <DropdownComponent
                                        data={orderedInstitutions}
                                        placeholder={institution?.name || "Intézmény kiválasztása"}
                                        searchPlaceholder="Intézmény keresése..."
                                        onSelect={handleInstSelect}
                                    />

                                    <View style={styles.dropdownContainer}>
                                        <SegmentedButtons
                                            value={String(currentBtnIndex)}
                                            onValueChange={(value) => setCurrentBtnIndex(Number(value))}
                                            density="regular"
                                            buttons={segmentedButtonOptions}
                                        />
                                        {renderTabContent()}
                                    </View>
                                </ScrollView>
                            )}
                    </Animated.View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
            {errorMessage && (
                <StatusMessage
                    message={errorMessage}
                    onClose={() => setErrorMessage('')}
                    type="error"
                />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "black",
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
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
    },
    card: {
        padding: 16,
        marginBottom: 20,
        borderRadius: 15,
    },
    dropdownContainer: {
        padding: 16,
        gap: 16,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
        paddingLeft: 16,
    },
    choiceList: {
        alignSelf: 'center',
    }
});