import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';
import { SCREEN_WIDTH } from '@/constants';
import { Icon, IconButton } from 'react-native-paper';

interface WeekNavigationProps {
  currentDate: Date;
  onWeekChange: (direction: 'prev' | 'next') => void;
}

export const WeekNavigation = ({ currentDate, onWeekChange }: WeekNavigationProps) => {
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);

  const formatWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <View style={[styles.weekNavigation, themeStyles.content, themeStyles.border]}>
      {/*  <Pressable
        style={styles.navButton}
        onPress={() => onWeekChange('prev')}
      >
        <ChevronLeft color={themeStyles.textSecondary.color} size={24} />
        <ChevronLeft color={themeStyles.textSecondary.color} size={24} style={styles.secondArrow} />
      </Pressable> */}
      { /* convert pressable to iconbutton*/}

      <IconButton
        icon='arrow-left'
        size={24}
        onPress={() => onWeekChange('prev')}
      />
      <Text style={[styles.weekText, themeStyles.textSecondary]}>

        {formatWeekRange(currentDate)}
      </Text>
      <IconButton
        icon='arrow-right'
        size={24}
        onPress={() => onWeekChange('next')}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  timetableContainer: {
    flex: 1,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  secondArrow: {
    marginLeft: -12,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysList: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  activeDayTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
  },
  dayText: {
    fontSize: 16,
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
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});