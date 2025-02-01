import { useInstitutionData } from "@/hooks/useInstitutionData";
import { useTimetable } from "@/hooks/useTimetable";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TimetableView } from "@/components/TimeTableView";
import { BASE_URL, SCREEN_WIDTH } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Linking, Pressable, SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import { Settings } from 'lucide-react-native';
import { SettingsModal } from "@/components/SettingsModal";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { StatusBar } from "expo-status-bar";
import ViewToggle from "@/components/ViewToggle";

export default function TimetableScreen() {

  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);
  const { inst } = useLocalSearchParams();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [showEvents, setShowEvents] = useState(false);
  const daysListRef = useRef<FlatList>(null);
  const appointmentsListRef = useRef<FlatList>(null);

  const { data, loading: institutionLoading, error: institutionError } = useInstitutionData(inst);
  const { appointments, events, loading, error } = useTimetable({ inst, selectedView, selectedId });

  useEffect(() => {
    if (!inst) {
      AsyncStorage.getItem('institution').then((id) => {
        (id !== null) && router.replace(`/?inst=${id}` as any);
      });
    }
  }, [inst]);

  useEffect(() => {
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

  useEffect(() => {
    const updateTitle = async () => {
      if (data?.rooms && selectedId && selectedView) {
        const selectedName = data.rooms.find((item: any) => item.id === selectedId)?.name
          || data.presentators.find((item: any) => item.id === selectedId)?.name
          || data.timetables.find((item: any) => item.id === selectedId)?.name;
        if (selectedName) {
          setSelectedTitle(`${selectedName}`);
        }
      }
    };
    updateTitle();
  }, [data, selectedId, selectedView]);

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
    AsyncStorage.setItem('timetable', JSON.stringify({ id: id, endpoint: endpoint }));
    setSelectedView(endpoint);
    setModalVisible(false);
  };

  const handleWebsitePress = async () => {
    if (data.institution?.website) {
      try {
        await Linking.openURL(data.institution.website);
      } catch (error) {
        console.error('Hiba a weboldal megnyitása közben: ', error);
      }
    }
  };

  const handleDayChange = (index: number) => {
    if (appointmentsListRef.current) {
      appointmentsListRef.current.scrollToOffset({
        offset: index * SCREEN_WIDTH,
        animated: true
      });
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentDayIndex(newIndex);

      if (daysListRef.current) {
        daysListRef.current.scrollToIndex({
          index: newIndex,
          animated: true,
          viewPosition: 0.5
        });
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

            {selectedTitle || 'Válassz órarendet'}
          </Text>

          {selectedView === 'timetable' && !error &&
            <View style={styles.toggleCenterContainer}>
              <ViewToggle onViewChange={() => setShowEvents(!showEvents)} />
            </View>
          }
          <Pressable
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
          >
            <Settings color={themeStyles.textSecondary.color} size={28} />
          </Pressable>
        </View>
      </SafeAreaView>
      {institutionError ? (
        <ErrorMessage message={institutionError} />
      ) : selectedId ? (
        <>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <TimetableView
              appointments={appointments}
              events={events}
              currentDayIndex={currentDayIndex}
              onDayChange={handleDayChange}
              daysListRef={daysListRef}
              appointmentsListRef={appointmentsListRef}
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
        onWebsitePress={handleWebsitePress}
        loading={institutionLoading}
        data={data}
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