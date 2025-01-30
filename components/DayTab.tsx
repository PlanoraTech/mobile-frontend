import { getThemeStyles } from "@/assets/styles/themes";
import { DAY_TRANSLATIONS, SCREEN_WIDTH } from "@/constants";
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
  timetableContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  daysListContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  daysList: {
    maxHeight: 60,
  },
  daysListContent: {
    flexGrow: 1,
  },
  dayTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
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
  dayPage: {
    width: SCREEN_WIDTH,
    padding: 10,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});