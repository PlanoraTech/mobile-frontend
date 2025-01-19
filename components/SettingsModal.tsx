import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { InstitutionHeader } from '@/components/InstitutionHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import DropdownComponent from '@/components/Dropdown';
import { Institution } from '@/types';


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
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScrollView}>
                        <InstitutionHeader
                            institution={institution}
                            onPress={onWebsitePress}
                        />

                        <View style={styles.dropdownContainer}>
                            <Text style={styles.sectionTitle}>Órarendek</Text>
                            {loading.timetables ? (
                                <LoadingSpinner />
                            ) : (
                                <DropdownComponent
                                    data={data.timetables}
                                    placeholder="Válassz órarendet"
                                    label="Órarend"
                                    searchPlaceholder="Órarend keresése..."
                                    onSelect={(item) => onSelect(item, 'timetable')}
                                />
                            )}

                            <Text style={styles.sectionTitle}>Előadók</Text>
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

                            <Text style={styles.sectionTitle}>Termek</Text>
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
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    },
});