import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    FlatList,
    Platform,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent from '@/components/Dropdown';
import { DropdownData, Institution } from '@/types';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { TimetableButton } from './timetableButton';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { saveId } from '@/utils/saveId';
import { useAuth } from '@/contexts/AuthProvider';



interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    institution?: Institution | null;
    onWebsitePress: () => void;
    loading: {
        timetables: boolean;
        presentators: boolean;
        rooms: boolean;
    };
    institutions: DropdownData[];
    data: {
        institution: Institution | null;
        timetables: any[];
        presentators: any[];
        rooms: any[];
    };
    onSelect: (item: any, type: string) => void;
}

export const SettingsModal = ({
    visible,
    onClose,
    institutions,
    loading,
    data,
    onSelect
}: SettingsModalProps
) => {
    const { theme } = useTheme();
    const themeStyle = getThemeStyles(theme);
    const [currentBtnIndex, setCurrentBtnIndex] = useState(0);
    const { user } = useAuth();
    const handleInstSelect = (item: DropdownData) => {
        if (item.access === 'PRIVATE' && !user?.token) {
            onClose();
            router.replace('/login' as any);
            return;
        }
        saveId('institution', item.id);
        router.replace(`/?inst=${item.id}` as any);
    }

    return (

        <Modal
            animationType='fade'
            
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            >
            
            <StatusBar backgroundColor='rgba(0, 0, 0, 0.3)' />
            <View style={styles.modalContainer}>

                <View style={[styles.modalContent, themeStyle.content]}>

                    <View style={[styles.modalHeader, themeStyle.border]}>
                        <Text style={[styles.modalTitle, themeStyle.textSecondary]}>Órarend beállítások</Text>
                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, themeStyle.textSecondary]}>×</Text>
                        </Pressable>
                    </View>


                    <ScrollView >
                    
                        <DropdownComponent
                            data={institutions}
                            placeholder={data.institution?.name || "Intézmény kiválasztása"}
                            label="Intézmény"
                            searchPlaceholder="Intézmény keresése..."
                            onSelect={(item: DropdownData) => {handleInstSelect(item)}}
                            dropDirection='bottom'
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
                                    onPress={() => { setCurrentBtnIndex(index) }} />
                                )}
                                />
                            {currentBtnIndex === 0 && (
                                <View style={styles.card}>
                                    {loading.timetables ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <DropdownComponent
                                        data={data.timetables}
                                        dropDirection='bottom'
                                        placeholder="Válassz órarendet"
                                        label="Órarend"
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
                                            dropDirection='bottom'
                                            placeholder="Válassz előadót"
                                            label="Előadó"
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
                                            dropDirection='bottom'
                                            placeholder="Válassz termet"
                                            label="Terem"
                                            searchPlaceholder="Terem keresése..."
                                            onSelect={(item) => onSelect(item, 'rooms')}
                                            />
                                        )}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                
                </View>
           
            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    
    },
    modalContent: {
        borderRadius: 10,
        width: "100%",
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

