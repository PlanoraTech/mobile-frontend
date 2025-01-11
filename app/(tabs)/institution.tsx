import DropdownComponent from "@/components/Dropdown";
import { Institution } from "@/types/Institution";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    Animated
} from "react-native";

export default function InstitutionScreen() {
    const { inst } = useGlobalSearchParams();
    const [institution, setinstitution] = useState<Institution>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchinstitution = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://192.168.1.2:3000/api/institutions/${inst}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setinstitution(data);
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
                console.log(inst);
            }
        };

        if (inst) {
            fetchinstitution();
        }
    }, [inst]);

    if (isLoading) return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
        </View>
    );

    if (error) return (
        <View style={styles.centerContainer}>
            <Text style={styles.error}>{error}</Text>
        </View>
    );

    if (!institution) return (
        <View style={styles.centerContainer}>
            <Text style={styles.error}>Nincs intézmény kiválasztva</Text>
        </View>
    );

    return (
        <View style={styles.container}>
          <Text style={styles.institutionName}>{institution.name}</Text>
          <DropdownComponent 
            data={institution.timetables}
            placeholder="Válassz órarendet"
            label="Órarend"
            onSelect={(item) => {
              console.log('Selected timetable:', item);
            }}
          />
        </View>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    institutionName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 16,
    },

    error: {
        color: '#FF3B30',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
        paddingHorizontal: 30,
    },
});