import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet
} from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent from '@/components/Dropdown';
import { Institution } from '@/types';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';



interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    institution: Institution;
    onWebsitePress: () => void;
    loading: {
        timetables: boolean;
        presentators: boolean;
        rooms: boolean;
        groups: boolean;
    };
    data: {
        timetables: any[];
        presentators: any[];
        rooms: any[];
        groups: any[];
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
    const [selectedGroup, setSelectedGroup] = useState("");
    console.log(data.timetables);
    console.log(selectedGroup);
    const filteredTimetable = selectedGroup ? data.timetables.filter((timetable) => timetable.groups[0].id === selectedGroup) : data.timetables;
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, themeStyle.content]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Órarend beállítások</Text>
                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>×</Text>
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
                            <View style={[styles.card, themeStyle.content]}>



                                {loading.groups ? (
                                    <LoadingSpinner />
                                ) : (

                                    <DropdownComponent
                                        data={data.groups}
                                        placeholder="Szűrés csoportra"
                                        label="Csoport"
                                        searchPlaceholder="Keresés..."
                                        onSelect={(item) => setSelectedGroup(item.id)}
                                        customStyles={styles.groupDropdown}

                                    />

                                )}

                                {loading.timetables ? (
                                    <LoadingSpinner />
                                ) : (
                                    <DropdownComponent
                                        data={filteredTimetable}
                                        placeholder="Válassz órarendet"
                                        label="Órarend"
                                        searchPlaceholder="Órarend keresése..."
                                        onSelect={(item) => onSelect(item, 'timetable')}
                                    />
                                )}
                            </View>

                            <View style={[styles.card, themeStyle.content]}>

                                {loading.presentators ? (
                                    <LoadingSpinner />
                                ) : (
                                    <DropdownComponent
                                        data={data.presentators}
                                        dropDirection='top'
                                        placeholder="Válassz előadót"
                                        label="Előadó"
                                        searchPlaceholder="Előadó keresése..."
                                        onSelect={(item) => onSelect(item, 'presentators')}
                                    />
                                )}
                            </View>
                            <View style={[styles.card, themeStyle.content]}>
                                {loading.rooms ? (
                                    <LoadingSpinner />
                                ) : (

                                    <DropdownComponent
                                        data={data.rooms}
                                        dropDirection='top'
                                        placeholder="Válassz termet"
                                        label="Terem"
                                        searchPlaceholder="Terem keresése..."
                                        onSelect={(item) => onSelect(item, 'rooms')}
                                    />
                                )}
                            </View>
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
    },
    modalContent: {
        backgroundColor: '#d0d0c0',
        borderRadius: 10,
        width: "80%",
        shadowColor: "lightgrey",
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
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#666666',
    },
    modalScrollView: {
        flex: 1,
    },
    card: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 15,
        shadowColor: "lightgrey",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10
    },
    dropdownContainer: {
        padding: 16,
        gap: 16,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
        marginTop: 16,
        paddingLeft: 16,
    },
    groupDropdown: {
        width: '70%',
        alignSelf: 'center',
    },

});