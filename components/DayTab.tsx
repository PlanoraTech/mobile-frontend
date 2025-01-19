import { DAY_TRANSLATIONS, SCREEN_WIDTH } from "@/constants";
import { Pressable, Text, StyleSheet } from "react-native";

interface DayTabProps {
    day: string;
    isActive: boolean;
    onPress: () => void;
  }
  
  export const DayTab = ({ day, isActive, onPress }: DayTabProps) => (
    <Pressable 
      style={[styles.dayTab, isActive && styles.activeDayTab]}
      onPress={onPress}
    >
      <Text style={[styles.dayText, isActive && styles.activeDayText]}>
        {DAY_TRANSLATIONS[day]}
      </Text>
    </Pressable>
  );

  const styles = StyleSheet.create({
    dayTab: {
        paddingHorizontal: 5,
        paddingVertical: 15,
        width: SCREEN_WIDTH / 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDayTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0066cc',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
    },
    activeDayText: {
        color: '#0066cc',
        fontWeight: '700',
    },
});