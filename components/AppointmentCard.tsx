import React, { Fragment, useState, memo, useMemo, Suspense, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { formatTimeRange } from "@/utils/dateUtils";
import { DropdownItem } from "./Dropdown";
import { DayOfWeek } from "@/constants";
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from "@/contexts/AuthProvider";
import { useInstitutionId } from "@/contexts/InstitutionIdProvider";
import PresentatorAppointmentCard from "./PresentatorAppointmentCard";

export interface Appointment {
  id: string;
  subject: DropdownItem;
  presentators: DropdownItem[];
  rooms: DropdownItem[];
  dayOfWeek: DayOfWeek;
  start: string;
  end: string;
  isCancelled: boolean;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

interface FastTextProps {
  children: React.ReactNode;
  style: any;
}

interface PresentatorTextProps {
  presentators: DropdownItem[];
}

interface RoomTextProps {
  rooms: DropdownItem[];
}

const getCardStyle = (backgroundColor: string) => [
  styles.card,
  { backgroundColor }
];


const FastText = ({ children, style }: FastTextProps) => (
  <Text style={style}>{children}</Text>
);


const SimplePresentatorText = memo(({ presentators }: PresentatorTextProps) => (
  <FastText style={styles.presentatorText}>
    {presentators.map(p => p.name).join(', ')}
  </FastText>
));


export const SimpleRoomText = memo(({ rooms }: RoomTextProps) => (
  <FastText style={styles.roomText}>
    {rooms.map(r => r.name).join(' - ')}
  </FastText>
));

const AppointmentCard = memo(({ appointment }: AppointmentCardProps) => {
  const theme = useTheme();
  const cardStyle = useMemo(() => getCardStyle(theme.colors.surface), [theme.colors.surface]);


  const [isDetailedView, setIsDetailedView] = useState(false);
  const [presentatorCardVisible, setPresentatorCardVisible] = useState(false);


  const [normalPresentators, setPresentators] = useState(appointment.presentators.filter(p => !p.isSubstituted));
  const [substitutedPresentators, setSubstitutedPresentators] = useState(appointment.presentators.filter(p => p.isSubstituted));


  const { user } = useAuth();
  const { institutionId } = useInstitutionId();
  useEffect(() => {
    handlePress();
  }, []);

  const handlePress = () => {

    if (!isDetailedView) {
      setIsDetailedView(true);
      return;
    }

    if (!user || !user.institutions) return;

    const role = user.institutions.find(i => i.institutionId === institutionId)?.role;
    if (role === 'PRESENTATOR' || role === 'DIRECTOR') {
      setPresentatorCardVisible(!presentatorCardVisible);
    }
  };
  if (!isDetailedView) {
    return (
      <View style={cardStyle}>
        <Pressable onPress={handlePress}>
          <FastText style={styles.subjectName}>
            {appointment.subject.name}
          </FastText> 
          <FastText style={styles.timeText}>
            {formatTimeRange(appointment.start, appointment.end)}
          </FastText>
          <SimplePresentatorText presentators={appointment.presentators} />
          {appointment.rooms.length > 0 && <SimpleRoomText rooms={appointment.rooms} />}
          {appointment.isCancelled && (
            <FastText style={styles.cancelledText}>ELMARAD</FastText>
          )}
        </Pressable>
      </View>
    );
  }


  if (presentatorCardVisible) {
    return (
      <Suspense fallback={<View style={cardStyle}><Text>Loading...</Text></View>}>
        <PresentatorAppointmentCard
          appointment={appointment}
          substitutedPresentators={substitutedPresentators}
          setSubstitutedPresentators={setSubstitutedPresentators}
          presentators={normalPresentators}
          setPresentators={setPresentators}
        />
      </Suspense>
    );
  }

  return (
    <View style={cardStyle}>
      <Pressable onPress={handlePress}>
        <FastText style={styles.subjectName}>
          {appointment.subject.name}
        </FastText>
        <FastText style={styles.timeText}>
          {formatTimeRange(appointment.start, appointment.end)}
        </FastText>
        {appointment.presentators.length > 0 && 
        <FastText style={styles.presentatorText}>
          {appointment.presentators.map((p, index, array) => (
            <Fragment key={p.id}>
              <Text
                style={[
                  styles.presentatorText,
                  p.isSubstituted && { textDecorationLine: 'line-through' }
                ]}
                >
                {p.name}
              </Text>
              {index < array.length - 1 && <Text>, </Text>}
            </Fragment>
          ))}
        </FastText>
        }

        {appointment.rooms.length > 0 && <SimpleRoomText rooms={appointment.rooms} />}

        {appointment.isCancelled && (
          <FastText style={styles.cancelledText}>ELMARAD</FastText>
        )}
      </Pressable>
    </View>
  );
});



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  cancelledText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 5,
  },
  cancelledCard: {
    opacity: 0.7,
  },
  roomText: {
    fontSize: 14,
  },
  presentatorText: {
    fontSize: 14,
    marginBottom: 3,
  },
  card: {
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionCard: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 5,
  },
  optionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  },
  timeText: {
    fontSize: 16,
    color: '#0066cc',
    marginBottom: 5,
    fontWeight: '600',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
});

export default AppointmentCard;