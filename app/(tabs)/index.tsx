import { useInstitutionData } from "@/hooks/useInstitutionData";
import { useTimetable } from "@/hooks/useTimetable";
import { StatusMessage } from "@/components/StatusMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TimetableView } from "@/components/TimeTableView";
import { BASE_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { FlatList, Pressable, SafeAreaView, View, StyleSheet, Platform, Text } from "react-native";
import { Settings } from 'lucide-react-native';
import { SettingsModal } from "@/components/SettingsModal";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { StatusBar } from "expo-status-bar";
import ViewToggle from "@/components/ViewToggle";
import { getCurrentDayIndex } from "@/utils/dateUtils";
import NotFoundContent from "@/components/NotFoundContent";
import { IconButton } from "react-native-paper";

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
  const { appointments, loading, error: timetableError } = useTimetable({ selectedView, selectedId });

  useEffect(() => {
    AsyncStorage.clear();
    fetchInstitutions();
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
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (dayChosenByTapRef.current === false) {
        setGoalDayIndex(newIndex)
      }
    }
  }).current;

  if (institutionLoading.institution) return <LoadingSpinner />;

  const renderTimetableContent = () => {


    if (!data.institution) {
      return <NotFoundContent onPress={() => setModalVisible(true)} message="Válassz intézményt a beállítások gombbal" />;
    }

    if (timetableError && !showEvents) {
      return <NotFoundContent onPress={() => setModalVisible(true)} message="Nem sikerült betölteni az elmentett/kiválasztott órarendet. Válassz új órarendet a beállítások gombbal." />;
    }

    if (selectedId === "" && !showEvents) {
      return <NotFoundContent onPress={() => setModalVisible(true)} message="Válassz órarendet, előadót vagy termet a beállítások gombbal" />;
    }

    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <TimetableView
        appointments={appointments}
        events={data.events}
        onDayChange={handleDayChange}
        onScrolltoIndexEnd={handleScrolltoIndexEnd}
        goalDayIndex={goalDayIndex}
        cardsListRef={cardsListRef as RefObject<FlatList>}
        handleViewableItemsChanged={handleViewableItemsChanged}
        showedList={showEvents ? 'events' : 'appointments'}
      />
    );
  };

  return (
    <View style={[styles.container, themeStyles.content, Platform.OS === 'ios' ? { paddingTop: 0 } : { paddingTop: 24 }]}>
      <StatusBar backgroundColor={themeStyles.content.backgroundColor} />
      <SafeAreaView style={[styles.header, themeStyles.content]}>

        <View style={styles.headerContent}>
          {data.institution ?
            <View style={styles.toggleCenterContainer}>
              <ViewToggle leftText="Órarend" rightText="Esemény" onViewChange={() => setShowEvents(!showEvents)} />
            </View>
            :
            <View style={styles.toggleCenterContainer}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Planora</Text>
            </View>
          }
          <IconButton icon="cog" size={28} onPress={() => setModalVisible(true)} />
        </View>
      </SafeAreaView>

      {renderTimetableContent()}

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
      {institutionError && <StatusMessage type="error" message={institutionError} />}
      {timetableError && <StatusMessage type="error" message={timetableError} />}
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

  settingsButton: {
    padding: 8,
    alignSelf: 'flex-end'
  },
});