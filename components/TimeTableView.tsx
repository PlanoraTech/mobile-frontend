import { DAYS, SCREEN_WIDTH } from "@/constants";
import { Appointment } from "@/types";
import React from "react";
import { FlatList, View, StyleSheet, ScrollView } from "react-native";
import { AppointmentCard } from "@/components/AppointmentCard";
import { DayTab } from "./DayTab";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";

interface TimetableViewProps {
  appointments: Appointment[];
  currentDayIndex: number;
  onDayChange: (index: number) => void;
  daysListRef: React.RefObject<FlatList>;
  appointmentsListRef: React.RefObject<FlatList>;
  handleViewableItemsChanged: (info: { viewableItems: any[] }) => void;
}

export const TimetableView = ({
  appointments,
  currentDayIndex,
  onDayChange,
  daysListRef,
  appointmentsListRef,
  handleViewableItemsChanged
}: TimetableViewProps) => {
  const { theme } = useTheme();
  const themeStyle = getThemeStyles(theme);

  const renderDayPage = ({ index }: { index: number }) => {
    const dayAppointments = appointments
      .filter(appointment => appointment.dayOfWeek.toUpperCase() === DAYS[index])
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return (
      <ScrollView style={styles.dayPage}>
        <FlatList
          data={dayAppointments}
          keyExtractor={(appointment) => appointment.id}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    );
  };

  return (
    <View style={[styles.timetableContainer, themeStyle.background]}>
      <FlatList
        ref={daysListRef}
        data={DAYS}
        keyExtractor={(item) => item}
        horizontal
        style={[styles.daysList, themeStyle.content]}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <DayTab
            day={item}
            isActive={index === currentDayIndex}
            onPress={() => onDayChange(index)}
          />
        )}
      />
      <FlatList
        ref={appointmentsListRef}
        data={DAYS}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
          minimumViewTime: 0,
        }}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={renderDayPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timetableContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    marginTop: 16,
  },
  daysList: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayPage: {
    width: SCREEN_WIDTH,
    padding: 10,
  },
});