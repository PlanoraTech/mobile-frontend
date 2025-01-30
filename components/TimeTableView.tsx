import { DAYS, SCREEN_WIDTH } from "@/constants";
import { Appointment, DayEvent } from "@/types";
import React, { useState, useEffect } from "react";
import { FlatList, View, StyleSheet, ScrollView, Text, PanResponder, Animated } from "react-native";
import { AppointmentCard } from "@/components/AppointmentCard";
import { DayTab } from "./DayTab";
import { WeekNavigation } from "./WeekNavigation";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { EventCard } from "./EventCard";

interface TimetableViewProps {
  appointments: Appointment[];
  currentDayIndex: number;
  onDayChange: (index: number) => void;
  daysListRef: React.RefObject<FlatList>;
  events: DayEvent[];
  appointmentsListRef: React.RefObject<FlatList>;
  showedList: 'appointments' | 'events';
  handleViewableItemsChanged: (info: { viewableItems: any[] }) => void;
}

export const TimetableView = ({
  appointments,
  currentDayIndex,

  onDayChange,
  daysListRef,
  appointmentsListRef,
  showedList,
  events,
  handleViewableItemsChanged
}: TimetableViewProps) => {
  const { theme } = useTheme();
  const themeStyle = getThemeStyles(theme);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isSameDayUTC = (date1: Date, date2: Date) => {
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getCurrentWeekDates = () => {
    const dates = [];
    const monday = new Date(currentDate);
    
    monday.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getCurrentWeekDates();
 
  const renderDayPage = ({ index }: { index: number }) => {
    const currentDayDate = weekDates[index];
    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start);
      return isSameDayUTC(appointmentDate, currentDayDate);
    }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  

    return (
      <View
        style={styles.dayPage}
      >
        {dayAppointments.length === 0 ? (
          <View style={[styles.notFoundContainer, themeStyle.content]}>
            <Text style={[themeStyle.textSecondary, styles.notFoundText]}>
              Ezen a napon nincs előadás
            </Text>
          </View>
        ) : (
          <ScrollView>
            <FlatList
              data={dayAppointments}
              keyExtractor={(appointment) => appointment.id}
              renderItem={({ item }) => (
                <AppointmentCard appointment={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </ScrollView>
        )}
      </View>
    );
  };
  const renderEventpage = ({ index }: { index: number }) => {
    const currentDayDate = weekDates[index]; 
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDayUTC(eventDate, currentDayDate);
    });
    return (
      <View
        style={styles.dayPage}
        
      >
        {dayEvents.length === 0 ? (
          <View style={[styles.notFoundContainer, themeStyle.content]}>
            <Text style={[themeStyle.textSecondary, styles.notFoundText]}>
              Erre a napra nincs esemény megadva
            </Text>
          </View>
        ) : (
          <ScrollView>
            <FlatList
              data={dayEvents}
              keyExtractor={(event) => event.id}
              renderItem={({ item }) => (
                <EventCard event={item} />
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.timetableContainer, themeStyle.background]}>
      <WeekNavigation
        currentDate={currentDate}
        onWeekChange={handleWeekChange}
      />
      <View style={styles.daysListContainer}>
        <FlatList
          ref={daysListRef}
          data={DAYS}
          keyExtractor={(item) => item}
          horizontal
          style={[styles.daysList, themeStyle.content]}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysListContent}
          renderItem={({ item, index }) => (
            <DayTab
              day={item}
              date={weekDates[index].toLocaleDateString('hu-HU', { day: 'numeric', month: 'short' })}
              isActive={index === currentDayIndex}
              onPress={() => onDayChange(index)}
              width={SCREEN_WIDTH / 5}
            />
          )}
        />
      </View>
      { showedList === 'appointments' ? (

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
        />) : (
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
        renderItem={renderEventpage}
        />

      )}
    </View>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: SCREEN_WIDTH / 5,
  },
  activeDayTab: {
    borderBottomWidth: 2,
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