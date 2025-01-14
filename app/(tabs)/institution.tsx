
import { router, useGlobalSearchParams } from "expo-router";
import { StyleSheet, View, Linking, ScrollView, Text } from "react-native";
import DropdownComponent from "@/components/Dropdown";
import { ErrorMessage } from '@/components/ErrorMessage';
import { InstitutionHeader } from '@/components/InstitutionHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useInstitutionData } from "@/assets/hooks/useInstitutionData";



export default function InstitutionScreen() {
    const { inst } = useGlobalSearchParams();
    const { data, loading, error } = useInstitutionData(inst);
    
    const handleWebsitePress = async () => {
        if (data.institution?.website) {
            try {
                await Linking.openURL(data.institution.website);
            } catch (error) {
                console.error('Hiba a weboldal megnyitása közben: ', error);
            }
        }
    };

    if (error) return <ErrorMessage message={error} />;
    
    if (loading.institution) return <LoadingSpinner />;

    if (!data.institution) {
        return <ErrorMessage message="Nincs kiválasztott intézmény!" />;
    }

    const handleSelection = (id: string, endpoint: string) => {
       router.push(`/${endpoint}?inst=${inst}&id=${id}`as any);
    }
    return (
        <ScrollView style={styles.container}>
            <InstitutionHeader 
                institution={data.institution}
                onPress={handleWebsitePress}
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
                        onSelect={(item) => {
                            handleSelection(item.id, 'timetable');
                        }}
                    />
                )}

                <Text style={styles.sectionTitle}>Csoportok</Text>
                {loading.groups ? (
                    <LoadingSpinner />
                ) : (
                    <DropdownComponent
                        data={data.groups}
                        placeholder="Válassz csoportot"
                        label="Csoport"
                        searchPlaceholder="Csoport keresése..."
                        onSelect={(item) => {
                            handleSelection(item.id, 'groups');
                        }}
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
                        onSelect={(item) => {
                            handleSelection(item.id, 'presentators');
                        }}
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
                        onSelect={(item) => {
                            handleSelection(item.id, 'rooms');  
                        }}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    dropdownContainer: {
        padding: 16,
        gap: 16,
    },
    institutionName: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        paddingHorizontal: 16,
        textDecorationLine: "underline",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
        marginTop: 16,
    },
    error: {
        color: "#FF3B30",
        fontSize: 16,
        textAlign: "center",
        margin: 20,
        paddingHorizontal: 30,
    },
});