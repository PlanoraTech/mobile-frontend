import { useInstitutionData } from "@/hooks/useInstitutionData";
import { useTimetable } from "@/hooks/useTimetable";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TimetableView } from "@/components/TimeTableView";
import { BASE_URL, SCREEN_WIDTH } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { FlatList, Pressable, SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import { Settings } from 'lucide-react-native';
import { SettingsModal } from "@/components/SettingsModal";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { StatusBar } from "expo-status-bar";
import ViewToggle from "@/components/ViewToggle";
import { getCurrentDayIndex } from "@/utils/dateUtils";

export default function TimetableScreen() {
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);


  const [goalDayIndex, setGoalDayIndex] = useState(getCurrentDayIndex());

  const [selectedView, setSelectedView] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [showEvents, setShowEvents] = useState(false);

  const cardsListRef = useRef<FlatList>(null);
  const dayChosenByTapRef = useRef(false);

  const { data, loading: institutionLoading, error: institutionError } = useInstitutionData();
  const { appointments, events, loading, error } = useTimetable({ selectedView, selectedId });

  useEffect(() => {
    fetchInstitutions();
    fetchSavedTimetable();
  }, []);

  const selectedTitle = () => {
    if (!selectedView) return 'Válassz órarendet';
    const selectedName = data.rooms.find((item: any) => item.id === selectedId)?.name
      || data.presentators.find((item: any) => item.id === selectedId)?.name
      || data.timetables.find((item: any) => item.id === selectedId)?.name;
    return `${selectedName || 'Válassz órarendet'}`;

  };

  const fetchSavedTimetable = async () => {
    const savedTimetable = await AsyncStorage.getItem('timetable');
    if (savedTimetable) {
      const { id, endpoint } = JSON.parse(savedTimetable);
      if (id) {
        setSelectedId(id);
        setSelectedView(endpoint);
        console.log('there is saved timetable');
      }
    }
  }

  const fetchInstitutions = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error('Hiba az intézmények betöltése során.');
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      console.error(error);
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
    console.log("hello")
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (dayChosenByTapRef.current === false) {
        setGoalDayIndex(newIndex)
      }
    }
  }).current;


  if (institutionLoading.institution) return <LoadingSpinner />;

  return (
    <View style={[styles.container, themeStyles.content, Platform.OS === 'ios' ? { paddingTop: 0 } : { paddingTop: 24 }]}>
      <StatusBar backgroundColor={themeStyles.content.backgroundColor} />
      <SafeAreaView style={[styles.header, themeStyles.content]}>
        <View style={styles.headerContent}>


          <Text style={[styles.selectedTitle, themeStyles.text]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >

            {selectedTitle()}
          </Text>

          {selectedView === 'timetable' && !error && selectedId &&
            <View style={styles.toggleCenterContainer}>
              <ViewToggle onViewChange={() => setShowEvents(!showEvents)} />
            </View>
          }
          <Pressable
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
            testID="settings-button"
          >
            <Settings color={themeStyles.textSecondary.color} size={28} />
          </Pressable>
        </View>
      </SafeAreaView>
      {institutionError && <ErrorMessage message={institutionError} />}


      {selectedId ? (
        <>
          {loading ? (
            <LoadingSpinner />

          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <TimetableView
              appointments={appointments}
              events={events}
              onDayChange={handleDayChange}
              onScrolltoIndexEnd={handleScrolltoIndexEnd}
              goalDayIndex={goalDayIndex}
              cardsListRef={cardsListRef as RefObject<FlatList>}
              handleViewableItemsChanged={handleViewableItemsChanged}
              showedList={showEvents ? 'events' : 'appointments'}
            />
          )}
        </>
      ) : (
        <View style={[styles.noSelectionContainer, themeStyles.content]}>
          <Text style={[styles.noSelectionText, themeStyles.textSecondary]}>
            Válassz órarendet, előadót vagy termet a beállítások gombbal
          </Text>
        </View>

      )}

      <SettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        institutions={institutions}
        loading={institutionLoading}
        data={data}
        onInstChange={() => setSelectedId("")}
        onSelect={(item, type) => {
          handleSelection(item.id, type.toLowerCase());
        }}


      />
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
    justifyContent: 'space-between',
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
  selectedTitle: {
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
    alignSelf: 'flex-end'
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSelectionText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});