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
import { Scroll } from 'lucide-react-native';



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
                <View style={styles.modalContent}>
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


                        />
                        <View style={styles.dropdownContainer}>
                            <View style={styles.card}>

                                <View style={styles.timetableHeader}>

                                    {loading.groups ? (
                                        <LoadingSpinner />
                                    ) : (

                                        <DropdownComponent
                                            data={data.groups}
                                            placeholder="Szűrés"
                                            label="Csoport"
                                            searchPlaceholder="Keresés..."
                                            onSelect={(item) => setSelectedGroup(item.id)}
                                            customStyles={styles.groupDropdown}

                                        />

                                    )}
                                </View>
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

                            <View style={styles.card}>

                                {loading.presentators ? (
                                    <LoadingSpinner />
                                ) : (
                                    <DropdownComponent
                                        data={data.presentators}
                                        placeholder="Válassz előadót"
                                        label="Előadó"
                                        searchPlaceholder="Előadó keresése..."
                                        onSelect={(item) => onSelect(item, 'presentators')}
                                    />
                                )}
                            </View>
                            <View style={styles.card}>

                                {loading.rooms ? (
                                    <LoadingSpinner />
                                ) : (

                                    <DropdownComponent
                                        data={data.rooms}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: 350
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
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownContainer: {
        padding: 16,
        gap: 16,
    },
    timetableHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        width: 120,

    },

});