import { DAYS, SCREEN_WIDTH } from "@/constants";
import { Appointment } from "@/components/AppointmentCard";
import { DayEvent } from "@/components/EventModal";
import React, { RefObject, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import AppointmentCard from "@/components/AppointmentCard";
import { DayTab } from "./DayTab";
import { WeekNavigation } from "./WeekNavigation";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { EventCard } from "./EventCard";
import { AddEventCard } from "./AddEventCard";
import { useAuth } from "@/contexts/AuthProvider";
import { getCurrentWeekDates, isSameDayUTC } from "@/utils/dateUtils";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
interface TimetableViewProps {
  appointments: Appointment[];
  onDayChange: (index: number) => void;
  onScrolltoIndexEnd: () => void;
  events: DayEvent[];
  cardsListRef: RefObject<FlatList>;
  goalDayIndex: number;
  showedList: 'appointments' | 'events';
  handleViewableItemsChanged: (info: { viewableItems: any[] }) => void;
}

export const TimetableView = ({
  appointments,
  goalDayIndex,
  onDayChange,
  onScrolltoIndexEnd,
  cardsListRef,
  showedList,
  events,
  handleViewableItemsChanged
}: TimetableViewProps) => {
  console.log("appointments", appointments);
  const { theme } = useTheme();
  const { user } = useAuth();
  const themeStyle = getThemeStyles(theme);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { institutionId } = useInstitutionId();
  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const weekDates = getCurrentWeekDates(currentDate);

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
          <View style={[styles.notFoundContainer, themeStyle.background]}>
            <Text style={[themeStyle.textSecondary, styles.notFoundText]}>
              Ezen a napon nincs előadás
            </Text>
          </View>
        ) : (

          <FlatList
            data={dayAppointments}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            keyExtractor={(appointment) => appointment.id}
            renderItem={({ item }) => (
              <AppointmentCard appointment={item} />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled
          />

        )}
      </View>
    );
  };

  const renderEventpage = ({ index }: { index: number }) => {
    const currentDayDate = weekDates[index];
    const isDirector = user?.institutions.some(inst => inst.institutionId === institutionId && inst.role === 'DIRECTOR');
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDayUTC(eventDate, currentDayDate);
    });

    return (
      <View
        style={styles.dayPage}
      >
        {dayEvents.length === 0 ? (
          isDirector ? (
            <AddEventCard currentDayDate={currentDayDate} />
          ) : (
            <View style={[styles.notFoundContainer, themeStyle.background]}>
              <Text style={[themeStyle.textSecondary, styles.notFoundText]}>
                Erre a napra nincs esemény megadva
              </Text>
            </View>
          )
        )
          : (
            <ScrollView>
              <FlatList
                data={dayEvents}
                keyExtractor={(event) => event.id!}
                renderItem={({ item }) => (
                  <EventCard event={item} />
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
              {isDirector && <AddEventCard currentDayDate={currentDayDate} />}
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

      <FlatList
        data={DAYS}
        keyExtractor={(item) => item}
        horizontal
        style={[styles.testContainer, themeStyle.content]}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <DayTab
            day={item}
            date={weekDates[index].toLocaleDateString('hu-HU', { day: 'numeric', month: 'short' })}
            isActive={index === goalDayIndex}
            onPress={() => onDayChange(index)}
            width={SCREEN_WIDTH / 5}
          />
        )}
      />

      {showedList === 'appointments' ? (
        <FlatList
          ref={cardsListRef}
          data={DAYS}
          keyExtractor={(item) => item}
          horizontal
          bounces={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          onMomentumScrollEnd={onScrolltoIndexEnd}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50, }}
          renderItem={renderDayPage}
        />
      ) : (
        <FlatList
          ref={cardsListRef}
          data={DAYS}
          keyExtractor={(item) => item}
          horizontal
          bounces={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          onMomentumScrollEnd={onScrolltoIndexEnd}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50, }}
          renderItem={renderEventpage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timetableContainer: {
    flex: 1,
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
  dayPage: {
    width: SCREEN_WIDTH,
    padding: 10,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,

  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  testContainer: {

    minHeight: 60,
    maxHeight: 60,
  },
});