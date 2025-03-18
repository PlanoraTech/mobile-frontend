import { useInstitutionData } from "@/hooks/useInstitutionData";
import { useTimetable } from "@/hooks/useTimetable";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TimetableView } from "@/components/TimeTableView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { FlatList, SafeAreaView, View, StyleSheet, Platform } from "react-native";
import { SettingsModal } from "@/components/SettingsModal";
import ViewToggle from "@/components/ViewToggle";
import { getCurrentDayIndex } from "@/utils/dateUtils";
import NotFoundContent from "@/components/NotFoundContent";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useInstitutions } from "@/hooks/useInstitutions";

export default function TimetableScreen() {
  const theme = useTheme();

  const [goalDayIndex, setGoalDayIndex] = useState(getCurrentDayIndex());
  const [selectedView, setSelectedView] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
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

  const {
    data: appointments,
    isLoading: timetableLoading,
    error: timetableError
  } = useTimetable({ selectedView, selectedId });


  useEffect(() => {
    AsyncStorage.clear();
    fetchSavedTimetable();
  }, []);

  const fetchSavedTimetable = async () => {
    const savedTimetable = await AsyncStorage.getItem('timetable');
    if (savedTimetable) {
      const { id, endpoint } = JSON.parse(savedTimetable);
      if (id) {
        setSelectedId(id);
        setSelectedView(endpoint);
      }
    }
  }

  const handleSelection = (id: string, endpoint: string) => {
    setSelectedId(id);
    setSelectedView(endpoint);
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


    if (!institution) {
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

    if (selectedId === "" && !showEvents) {
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
        appointments={appointments!}
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
      <SafeAreaView style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          {institution ? (
            <View style={styles.toggleCenterContainer}>
              <ViewToggle leftText="Órarend" rightText="Esemény" onViewChange={() => setShowEvents(!showEvents)} />
            </View>
          )
            : (
              <View style={styles.toggleCenterContainer}>
                <Text variant="titleMedium">Planora</Text>
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
        onInstChange={() => setSelectedId("")}
        onSelect={(item, type) => {
          handleSelection(item.id, type.toLowerCase());
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
});