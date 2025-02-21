import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    FlatList,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler
} from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent, { DropdownItem } from '@/components/Dropdown';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { TimetableButton } from './timetableButton';
import { router } from 'expo-router';
import { saveId } from '@/utils/saveId';
import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorMessage } from './ErrorMessage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    Easing
} from 'react-native-reanimated';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    loading: {
        timetables: boolean;
        presentators: boolean;
        rooms: boolean;
    };
    institutions: DropdownItem[];
    data: {
        institution: DropdownItem | null;
        timetables: DropdownItem[];
        presentators: DropdownItem[];
        rooms: DropdownItem[];
    };
    onSelect: (item: DropdownItem, type: string) => void;
    onInstChange: () => void;
}

export const SettingsModal = ({
    visible,
    onClose,
    institutions,
    loading,
    data,
    onSelect,
    onInstChange
}: SettingsModalProps) => {
    const { theme } = useTheme();
    const themeStyle = getThemeStyles(theme);
    const { user } = useAuth();
    const { setInstitutionId } = useInstitutionId();

    const slideAnim = useSharedValue(-1000);
    const fadeAnim = useSharedValue(0);
    const displayValue = useSharedValue(0);

    const [currentBtnIndex, setCurrentBtnIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    
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

    const handleClose = useCallback(() => {
        runCloseAnimation(() => {
            onClose();
        });
    }, [runCloseAnimation, onClose]);

    const handleInstSelect = useCallback((item: DropdownItem) => {
        if (item.access === 'PRIVATE') {
            if (!user) {
                handleClose();
                router.replace('/login' as any);
                return;
            }
            if (!user?.institutions.some((instId: { id: string }) => {
                return instId.id === item.id;
            })) {
                handleClose();
                setErrorMessage('Nincs hozzáférésed ehhez az intézményhez');
                return;
            }
        }

        AsyncStorage.removeItem('timetable');

        saveId('institution', item.id);
        setInstitutionId(item.id);
        onInstChange();
    }, [user, handleClose, setInstitutionId, onInstChange]);

    const orderedInstitutions = useMemo(() =>
        [...institutions].sort((a) =>
            user?.institutions.some((instId: { id: string }) => instId.id === a.id) ? -1 : 1
        ),
        [institutions, user?.institutions]
    );


    if (!visible && displayValue.value === 0) {
        return null;
    }

    return (
        <>
            <Animated.View style={fadeAnimStyle

            }>

                <TouchableOpacity
                    testID="settings-modal"
                    onPress={handleClose}
                    activeOpacity={1}
                    style={[

                        styles.modalContainer,
                    ]}
                >
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                themeStyle.content,
                                slideAnimStyle
                            ]}
                        >
                            <View style={[styles.modalHeader, themeStyle.border]}>
                                <Text style={[styles.modalTitle, themeStyle.textSecondary]}>
                                    Órarend beállítások
                                </Text>
                                <Pressable
                                    onPress={handleClose}
                                    style={styles.closeButton}
                                >
                                    <Text style={[styles.closeButtonText, themeStyle.textSecondary]}>×</Text>
                                </Pressable>
                            </View>

                            <ScrollView>
                                <DropdownComponent
                                    data={orderedInstitutions}
                                    placeholder={data.institution?.name || "Intézmény kiválasztása"}
                                    searchPlaceholder="Intézmény keresése..."
                                    onSelect={handleInstSelect}
                                />
                                <View style={styles.dropdownContainer}>
                                    <FlatList
                                        style={styles.choiceList}
                                        horizontal
                                        data={["Órarend", "Előadó", "Terem"]}
                                        renderItem={({ item, index }) => (
                                            <TimetableButton
                                                choice={item}
                                                isActive={index === currentBtnIndex}
                                                onPress={() => setCurrentBtnIndex(index)}
                                            />
                                        )}
                                        keyExtractor={(item) => item}
                                    />
                                    {currentBtnIndex === 0 && (
                                        <View style={styles.card}>
                                            {loading.timetables ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <DropdownComponent
                                                    data={data.timetables}
                                                    placeholder="Válassz órarendet"
                                                    searchPlaceholder="Órarend keresése..."
                                                    onSelect={(item) => onSelect(item, 'timetable')}
                                                />
                                            )}
                                        </View>
                                    )}

                                    {currentBtnIndex === 1 && (
                                        <View style={styles.card}>
                                            {loading.presentators ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <DropdownComponent
                                                    data={data.presentators}
                                                    placeholder="Válassz előadót"
                                                    searchPlaceholder="Előadó keresése..."
                                                    onSelect={(item) => onSelect(item, 'presentators')}
                                                />
                                            )}
                                        </View>
                                    )}

                                    {currentBtnIndex === 2 && (
                                        <View style={styles.card}>
                                            {loading.rooms ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <DropdownComponent
                                                    data={data.rooms}
                                                    placeholder="Válassz termet"
                                                    searchPlaceholder="Terem keresése..."
                                                    onSelect={(item) => onSelect(item, 'rooms')}
                                                />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Animated.View>
            {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}
        </>
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