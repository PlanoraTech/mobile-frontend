import { Institution } from "@/types/Institution";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, ActivityIndicator, View } from "react-native";

export default function TimeTable() {
    const { inst } = useGlobalSearchParams();
    const [timetable, settimetable] = useState<Institution>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDay, setCurrentDay] = useState('monday');

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://192.168.1.2:3000/api/institutions/${inst}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                settimetable(data);
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
                console.log(inst)
            }
        };
        
        if (inst) {
            fetchTimetable();
        }
    }, [inst]);

    if (isLoading) return <ActivityIndicator size="large" />;
    if (error) return <Text style={styles.error}>{error}</Text>;
    return (
        <View>
            {timetable && <Text>{timetable.name}</Text>}
            {/*
            <FlatList 
                data={timetable} 
                style={styles.list}
                renderItem={({ item }) => (
                    <Text style={styles.lesson}>{item.name}</Text>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            */}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    lesson: {
        fontSize: 16,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        margin: 10,
    }
});