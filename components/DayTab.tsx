import { getThemeStyles } from "@/assets/styles/themes";
import { DAY_TRANSLATIONS } from "@/constants";
import { useTheme } from "@/contexts/ThemeProvider";
import { Pressable, Text, StyleSheet } from "react-native";
interface DayTabProps {
  day: string;
  date: string;
  isActive: boolean;
  onPress: () => void;
  width: number;
}

export const DayTab = ({ day, date, isActive, onPress, width }: DayTabProps) => {
  const { theme } = useTheme();
  const themeStyle = getThemeStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.dayTab,
        themeStyle.border,
        { width },
        isActive && styles.activeDayTab,
        themeStyle.content,
      ]}
    >
      <Text style={[
        styles.dayText,
        themeStyle.text,
        isActive && styles.activeDayText
      ]}>
        {DAY_TRANSLATIONS[day]}
      </Text>
      <Text style={[
        styles.dateText,
        themeStyle.textSecondary,
        isActive && styles.activeDateText
      ]}>
        {date}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dayTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
  },
  activeDayTab: {
    borderBottomColor: '#0066cc',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
  },
  activeDayText: {
    color: '#0066cc',
  },
  activeDateText: {
    color: '#0066cc',
  },
});