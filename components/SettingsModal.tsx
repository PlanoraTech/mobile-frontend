import React, { useEffect, useState, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    FlatList,
    Animated
} from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent, { DropdownItem } from '@/components/Dropdown';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { TimetableButton } from './timetableButton';
import { router } from 'expo-router';
import { saveId } from '@/utils/saveId';
import { runCloseAnimation, runOpenAnimation } from '@/utils/animationUtils';


import { useAuth } from '@/contexts/AuthProvider';
import { useInstitutionId } from '@/contexts/InstitutionIdProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorMessage } from './ErrorMessage';
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

    const slideAnim = useRef(new Animated.Value(-1000)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [currentBtnIndex, setCurrentBtnIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (visible) {
            runOpenAnimation(slideAnim, fadeAnim);
            setModalVisible(true);


        } else {
            runCloseAnimation(slideAnim, fadeAnim, () => {
                setModalVisible(false);
            });
        }


    }, [visible]);

    const handleClose = () => {
        runCloseAnimation(slideAnim, fadeAnim, () => {
            setModalVisible(false);
            onClose();
        });



    };



    const handleInstSelect = (item: DropdownItem) => {
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

        //upon app start there won't be faulty institutionId timetableId pairs
        AsyncStorage.removeItem('timetable');

        saveId('institution', item.id);
        setInstitutionId(item.id);
        onInstChange();

    }


    const orderedInstitutions = [...institutions].sort((a, b) => user?.institutions.some((instId: { id: string }) => instId.id === a.id) ? -1 : 1);



    return (
        <>
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
                            backgroundColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.modalContent,
                            themeStyle.content,
                            {
                                transform: [{ translateY: slideAnim }]
                            }
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
                                onSelect={(item: DropdownItem) => { handleInstSelect(item) }}

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
                                            onPress={() => { setCurrentBtnIndex(index) }}
                                        />
                                    )}
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
                </Animated.View>
            </Modal>
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