import { useInstitutionData } from "@/hooks/useInstitutionData";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TimetableView } from "@/components/TimeTableView";
import React, { useRef, useState, RefObject } from "react";
import { FlatList, SafeAreaView, View, StyleSheet, Platform } from "react-native";
import { SettingsModal } from "@/components/SettingsModal";
import ViewToggle from "@/components/ViewToggle";
import { getCurrentDayIndex } from "@/utils/dateUtils";
import NotFoundContent from "@/components/NotFoundContent";
import { IconButton, useTheme } from "react-native-paper";
import { useInstitutions } from "@/hooks/useInstitutions";
import { StatusBar } from "expo-status-bar";
import { useTimetable } from "@/contexts/TimetableProvider";
// Import the new logo component
import PlanoraLogo from "@/components/PlanoraLogo";

export default function TimetableScreen() {
  const theme = useTheme();

  const [goalDayIndex, setGoalDayIndex] = useState(getCurrentDayIndex());
  const [modalVisible, setModalVisible] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const cardsListRef = useRef<FlatList>(null);
  const dayChosenByTapRef = useRef(false);

  const {
    data: institutions,
    isLoading: institutionsLoading,
    error: institutionsError } = useInstitutions();

  const {
    institution,
    isLoading: institutionLoading,
    error: institutionError } = useInstitutionData();

  const { timetable, timetableLoading, timetableError, appointmentsQuery } = useTimetable();

  const handleSelection = () => {
    setModalVisible(false);
  };

  const handleDayChange = (index: number) => {
    dayChosenByTapRef.current = true;
    if (cardsListRef.current) {
      setGoalDayIndex(index);
      cardsListRef.current?.scrollToIndex({
        index: index,
      });
    }
  };

  const handleScrolltoIndexEnd = () => {
    dayChosenByTapRef.current = false;
  }

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (dayChosenByTapRef.current === false) {
        setGoalDayIndex(newIndex)
      }
    }
  }).current;


  const renderTimetableContent = () => {
    const appointments = appointmentsQuery.data || [];
    if (!institution?.id) {
      return <NotFoundContent
        onPress={() => setModalVisible(true)}
        message="Válassz intézményt a beállítások gombbal"
      />;
    }

    if (timetableError && !showEvents) {
      return <NotFoundContent
        onPress={() => setModalVisible(true)}
        message="Nem sikerült betölteni az elmentett/kiválasztott órarendet. Válassz új órarendet a beállítások gombbal."
      />;
    }

    if (timetable.selectedId === "" && !showEvents) {
      return <NotFoundContent
        onPress={() => setModalVisible(true)}
        message="Válassz órarendet, előadót vagy termet a beállítások gombbal"
      />;
    }

    if (timetableLoading) {
      return <LoadingSpinner />;
    }

    return (
      <TimetableView
        appointments={appointments}
        events={institution.events}
        onDayChange={handleDayChange}
        onScrolltoIndexEnd={handleScrolltoIndexEnd}
        goalDayIndex={goalDayIndex}
        cardsListRef={cardsListRef as RefObject<FlatList>}
        handleViewableItemsChanged={handleViewableItemsChanged}
        showedList={showEvents ? 'events' : 'appointments'}
      />
    );
  };

  if (institutionLoading) return <LoadingSpinner />;

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.surface },
      { paddingTop: Platform.OS === 'android' ? 24 : 0 }
    ]}>
      <StatusBar style="dark" backgroundColor={theme.colors.surface} />
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          {institution?.id ? (
            <View style={styles.toggleCenterContainer}>
              <ViewToggle leftText="Órarend" rightText="Esemény" onViewChange={() => setShowEvents(!showEvents)} />
            </View>
          )
            : (
              <View style={styles.logoContainer}>
                {/* Replace the Text component with the new logo */}
                <PlanoraLogo width={150} height={40} />
              </View>
            )
          }
          <IconButton icon="cog" size={28} onPress={() => setModalVisible(true)} />
        </View>
      </SafeAreaView>

      {renderTimetableContent()}

      <SettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        institutions={institutions}
        loading={institutionLoading || institutionsLoading}
        institution={institution}

        onSelect={() => {
          handleSelection();
        }}
      />
      {institutionError && <StatusMessage type="error" message={institutionError.message} />}
      {institutionsError && <StatusMessage type="error" message={institutionsError.message} />}
      {timetableError && <StatusMessage type="error" message={timetableError.message} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleCenterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 40,
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});