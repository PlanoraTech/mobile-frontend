import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BASE_URL } from '@/utils/baseUrl';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Pressable, 
  FlatList,
} from 'react-native';

enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday'
}

interface Appointment {
  id: string;
  subject?: {
    id: string;
    name: string;
  };
  presentators: {
    id: string;
    name: string;
  }[];
  rooms: {
    id: string;
    name: string;
  }[];
  dayOfWeek: DayOfWeek;
  start: string;
  end: string;
  isCancelled: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export default function TimetableScreen() {
  const { inst, id } = useGlobalSearchParams();
  const [appointments, setAppointments] = useState([] as Appointment[]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const daysListRef = useRef<FlatList>(null);
  const appointmentsListRef = useRef<FlatList>(null);
  const viewabilityConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 0,
  });

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${BASE_URL}/${inst}/timetables/${id}/appointments`
        );
        if (!response.ok) {
          throw new Error('Hiba az órarend betöltése során.');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error: any) {
        console.error(error.message || "Valami hiba történt...");
        setError('Hiba az órarend betöltése során. Kérjük próbáld újra később.');
      } finally {
        setLoading(false);
      }
    };

    if (inst && id) {
      fetchTimetable();
    }
  }, [id, inst]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDayChange = (index: number) => {

    if (appointmentsListRef.current) {
      appointmentsListRef.current.scrollToOffset({ 
        offset: index * SCREEN_WIDTH,
        animated: true
      });
    }
  };

  const translateDayOfWeek = (day: string) => {
    switch (day) {
      case 'MONDAY': return 'Hétfő';
      case 'TUESDAY': return 'Kedd';
      case 'WEDNESDAY': return 'Szerda';
      case 'THURSDAY': return 'Csütörtök';
      case 'FRIDAY': return 'Péntek';
      default: return day;
    }};

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

  const getItemLayout = useRef((data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  })).current;

  const onScrollToIndexFailed = useRef((info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 100));
    wait.then(() => {
      appointmentsListRef.current?.scrollToIndex({
        index: info.index,
        animated: true
      });
    });
  }).current;

  const renderDayTab = ({ item, index }: { item: string; index: number }) => (
    <Pressable 
      style={[
        styles.dayTab,
        index === currentDayIndex && styles.activeDayTab
      ]}
      onPress={() => handleDayChange(index)}
    >
      <Text style={[
        styles.dayText,
        index === currentDayIndex && styles.activeDayText
      ]}>
        {translateDayOfWeek(item)}
      </Text>
    </Pressable>
  );

  const renderDayPage = ({ item, index }: { item: string; index: number }) => {
    const dayAppointments = appointments.filter(
      appointment => appointment.dayOfWeek === DAYS[index]
    ).toSorted((a, b) => formatTime(a.start).localeCompare(formatTime(b.start)));

    return (
      <View style={styles.dayPage}>
        <FlatList
          data={dayAppointments}
          keyExtractor={(appointment) => appointment.id}
          renderItem={({ item: appointment }) => (
            <View style={[
              styles.appointmentCard,
              appointment.isCancelled && styles.cancelledCard
            ]}>
              <Text style={styles.subjectName}>
                {appointment.subject?.name}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(appointment.start)} - {formatTime(appointment.end)}
              </Text>
              <Text style={styles.presentatorText}>
                {appointment.presentators.map(p => p.name).join(', ')}
              </Text>
              <Text style={styles.roomText}>
                {appointment.rooms.map(r => r.name).join(', ')}
              </Text>
              {appointment.isCancelled && (
                <Text style={styles.cancelledText}>ELMARAD</Text>
              )}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={daysListRef}
        data={DAYS}
        keyExtractor={(item) => item}
        horizontal
        style={styles.daysList}
        showsHorizontalScrollIndicator={false}
        renderItem={renderDayTab}
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
        viewabilityConfig={viewabilityConfigRef.current}
        getItemLayout={getItemLayout}
        initialScrollIndex={currentDayIndex}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={renderDayPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  daysList: {
    maxHeight: 50,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayTab: {
    padding: 15,
    width: SCREEN_WIDTH / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
  },
  dayText: {
    fontSize: 16,
    wordWrap: 'no-wrap',
    color: '#666666',
  },
  activeDayText: {
    color: '#0066cc',
    fontWeight: '600',
  },
  dayPage: {
    width: SCREEN_WIDTH,
    padding: 10,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelledCard: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#0066cc',
    marginBottom: 5,
  },
  presentatorText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  roomText: {
    fontSize: 14,
    color: '#666666',
  },
  cancelledText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 5,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});