import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    FlatList
} from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent from '@/components/Dropdown';
import { Institution } from '@/types';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { TimetableButton } from './timetableButton';



interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    institution: Institution;
    onWebsitePress: () => void;
    loading: {
        timetables: boolean;
        presentators: boolean;
        rooms: boolean;
    };
    data: {
        timetables: any[];
        presentators: any[];
        rooms: any[];
    };
    onSelect: (item: any, type: string) => void;
}

export const SettingsModal = ({
    visible,
    onClose,
    institution,
    onWebsitePress,
    loading,
    data,
    onSelect
}: SettingsModalProps
) => {
    const { theme } = useTheme();
    const themeStyle = getThemeStyles(theme);
    const [currentBtnIndex, setCurrentBtnIndex] = useState(0);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, themeStyle.content]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, themeStyle.text]}>Órarend beállítások</Text>
                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: theme === 'dark' ? '#f5f5f5' : '#333333' }]}>×</Text>
                        </Pressable>
                    </View>

                    <ScrollView style={styles.modalScrollView}>

                        <DropdownComponent
                            data={data.timetables}
                            placeholder={institution.name}
                            label="Intézmény"
                            searchPlaceholder="Intézmény keresése..."
                            onSelect={(item) => onSelect(item, 'institution')}
                            customStyles={{}}


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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        borderRadius: 10,
        width: "80%",
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
        borderBottomColor: '#E5E5E5',
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
    darkCloseButtonText: {
        color: '#f5f5f5',
    },
    lightCloseButtonText: {
        color: '#333333',
    },
    modalScrollView: {
        flex: 1,
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
        color: '#333333',
        marginBottom: 8,
        marginTop: 16,
        paddingLeft: 16,
    },
    choiceList: {
        alignSelf: 'center',
    }
});