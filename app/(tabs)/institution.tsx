import { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    Linking,
    ScrollView,
    Pressable,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import DropdownComponent from "@/components/Dropdown";
import React from "react";
import { DropdownData } from "@/types/types";
interface Institution {
    id: string;
    name: string;
    website: string;
    color: string;
}



export default function InstitutionScreen() {
    const { inst } = useGlobalSearchParams();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [timetables, setTimetables] = useState([] as DropdownData[]);
    const [groups, setGroups] = useState([] as DropdownData[]);
    const [presentators, setPresentators] = useState([] as DropdownData[]);
    const [rooms, setRooms] = useState([] as DropdownData[]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTimetable, setSelectedTimetable] = useState<any>(null);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/institutions/${inst}`);
                if (!response.ok) {
                    console.log(response);
                    throw new Error("Nem sikerült betölteni az intézményt");
                }
                const data: Institution = await response.json();

                setInstitution(data);


            } catch (error: any) {
                setError(error.message || "Hiba az adatok kérése közben");
            }
        };

        const fetchTimetables = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/institutions/${inst}/timetables`);
                if (!response.ok) {
                    throw new Error("Nem sikerült betölteni az órarendeket");
                }
                const data = await response.json();
                setTimetables(data);
            } catch (error: any) {
                setError(error.message || "Hiba az adatok kérése közben");
            }
        }

        const fetchGroups = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/institutions/${inst}/groups`);
                if (!response.ok) {
                    throw new Error("Nem sikerült betölteni a csoportokat");
                }
                const data = await response.json();
                setGroups(data);
            } catch (error: any) {
                setError(error.message || "Hiba az adatok kérése közben");
            }
        }

        const fetchPresentators = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/institutions/${inst}/presentators`);
                if (!response.ok) {
                    throw new Error("Nem sikerült betölteni az előadókat");
                }
                const data = await response.json();
                setPresentators(data);
            } catch (error: any) {
                setError(error.message || "Hiba az adatok kérése közben");
            }
        }

        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3000/institutions/${inst}/rooms`);
                if (!response.ok) {
                    throw new Error("Nem sikerült betölteni a termeket");
                }
                const data = await response.json();
                setRooms(data);
            } catch (error: any) {
                setError(error.message || "Hiba az adatok kérése közben");
            }
        }

        if (inst) {
            fetchInstitution();
            fetchTimetables();
            fetchGroups();
            fetchPresentators();
            fetchRooms();
            setIsLoading(false);
        }
    }, []);

    const handleWebsitePress = async () => {
        if (institution?.website) {
            try {
                await Linking.openURL(institution.website);
            } catch (error) {
                setError("Nem sikerült megnyitni a weboldalt");
            }
        }
    };

    if (isLoading)
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
            </View>
        );

    if (error)
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );

    if (!institution)
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.error}>Nincs intézmény kiválasztva</Text>
            </View>
        );
    return (
        <ScrollView style={styles.container}>
            <Pressable onPress={handleWebsitePress}>
                <Text style={[styles.institutionName, { color: institution.color }]}>
                    {institution.name}
                </Text>
            </Pressable>
            <View style={styles.dropdownContainer}>
                <Text style={styles.sectionTitle}>Órarendek</Text>
                <DropdownComponent
                    data={timetables}
                    placeholder="Válassz órarendet"
                    label="Órarend"
                    searchPlaceholder="Órarend keresése..."
                    onSelect={(item) => {
                        setSelectedTimetable(item);
                        setSelectedGroup(null);
                    }}
                />


                <Text style={styles.sectionTitle}>Csoportok</Text>
                <DropdownComponent
                    data={groups}
                    placeholder="Válassz csoportot"
                    label="Csoport"
                    searchPlaceholder="Csoport keresése..."
                    onSelect={setSelectedGroup} />
          
             
                        <Text style={styles.sectionTitle}>Előadók</Text>
                <DropdownComponent
                    data={presentators}
                    placeholder="Válassz előadót"
                    label="Előadó"
                    searchPlaceholder="Előadó keresése..." onSelect={function (item: any): void {
                        throw new Error("Function not implemented.");
                    }} />



                <Text style={styles.sectionTitle}>Termek</Text>
                <DropdownComponent
                    data={rooms}
                    label="Terem"
                    placeholder="Válassz termet"
                    searchPlaceholder="Terem keresése..." onSelect={function (item: any): void {
                        throw new Error("Function not implemented.");
                    }} />

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