import DropdownComponent from "@/components/Dropdown";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DropdownData } from "@/types";
import { BASE_URL } from "@/utils/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";


interface Group {
    name: string;
    timetables: DropdownData[];
}
export default function GroupScreen() {
    const { inst, id } = useLocalSearchParams();
    const [group, setGroup] = useState(null as Group | null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGroupData = async () => {
            setIsLoading(true);
            try {
                if (inst && id) {
                    const response = await fetch(`${BASE_URL}/${inst}/groups/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to load group data');
                    }
                    const groupData = await response.json();
                    setGroup(groupData);
             
                } 
                else {
                    const savedGroupId = await AsyncStorage.getItem('group');
                    const savedInstId = await AsyncStorage.getItem('institution');
                    
                    if (savedGroupId && savedInstId) {
                        router.navigate(`/group?inst=${savedInstId}&id=${savedGroupId}`);
                    }
                }
            } catch (error) {
                console.error('Error loading group data:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadGroupData();
    }, [inst, id]); 

    console.log('group:', group);
    if (!group || isLoading) {
        return <LoadingSpinner />;
    }
    return <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>{group.name}</Text>
        <DropdownComponent data={group.timetables} label="" placeholder="Válassz órarendet...." searchPlaceholder={""} onSelect={function (item: any): void {
            throw new Error("Function not implemented.");
        }} />
    </ScrollView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});