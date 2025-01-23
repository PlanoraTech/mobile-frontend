import { useInstitutionData } from "@/hooks/useInstitutionData";
import { useTimetable } from "@/hooks/useTimetable";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TimetableView } from "@/components/TimeTableView";
import { SCREEN_WIDTH, TITLE_TRANSLATIONS } from "@/constants";
import { saveId } from "@/utils/saveId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Linking, Pressable, SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Settings } from 'lucide-react-native';
import { SettingsModal } from "@/components/SettingsModal";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";

export default function TimetableScreen() {
  const {theme} = useTheme();
  const themeStyles = getThemeStyles(theme);
  const { inst } = useLocalSearchParams();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  
  const daysListRef = useRef<FlatList>(null);
  const appointmentsListRef = useRef<FlatList>(null);

  const { data, loading: institutionLoading, error: institutionError } = useInstitutionData(inst);
  const { appointments, loading, error } = useTimetable({ inst, selectedView, selectedId });

  useEffect(() => {
    if (!inst) {
      AsyncStorage.getItem('institution').then((id) => {
        (id !== null) && router.navigate(`/institution?inst=${id}` as any);
      });
    }
  }, [inst]);

  const handleSelection = (id: string, endpoint: string) => {
    setSelectedView(endpoint);
    setSelectedId(id);
    saveId(endpoint, id);
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

  if (!inst) return <ErrorMessage message="Nincs kiválasztott intézmény!" />;
  if (institutionError) return <ErrorMessage message={institutionError} />;
  if (institutionLoading.institution) return <LoadingSpinner />;
  if (!data.institution) return <ErrorMessage message="Nincs kiválasztott intézmény!" />;

  return (
    <View style={[styles.container, themeStyles.background]}>  
      <SafeAreaView style={[styles.header, themeStyles.content]}>
        <View style={styles.headerContent}>
          <Text style={[styles.selectedTitle, themeStyles.text]}>
            {selectedTitle || 'Válassz órarendet'}
          </Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
          >
            <Settings color={themeStyles.secondaryText.color } size={28} />
          </Pressable>
        </View>
      </SafeAreaView>

      {selectedId ? (
        <>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <TimetableView
              appointments={appointments}
              currentDayIndex={currentDayIndex}
              onDayChange={handleDayChange}
              daysListRef={daysListRef}
              appointmentsListRef={appointmentsListRef}
              handleViewableItemsChanged={handleViewableItemsChanged}
            />
          )}
        </>
      ) : (
        <View style={styles.noSelectionContainer}>
          <Text style={[styles.noSelectionText, themeStyles.secondaryText]}>
            Válassz órarendet, előadót vagy termet a beállítások gombbal
          </Text>
        </View>
      )}

      <SettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        institution={data.institution}
        onWebsitePress={handleWebsitePress}
        loading={institutionLoading}
        data={data}
        onSelect={(item, type) => {
          setSelectedTitle(`${TITLE_TRANSLATIONS[type]} - ${item.name}`);
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
    borderBottomWidth: 1,
},
headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
},
selectedTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
},
settingsButton: {
    padding: 8,
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