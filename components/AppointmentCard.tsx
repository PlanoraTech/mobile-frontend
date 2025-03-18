import { Fragment, useState, memo } from "react";
import { StyleSheet, Pressable, View, Alert } from "react-native";
import { formatTimeRange } from "@/utils/dateUtils";
import { DropdownItem } from "./Dropdown";
import { DayOfWeek, SCREEN_WIDTH } from "@/constants";
import Animated, {
} from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { set } from "date-fns";
import PresentatorAppointmentCard from "./PresentatorAppointmentCard";



interface AppointmentCardProps {
  appointment: Appointment;
}

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

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const theme = useTheme()

  const substitutedPresentators = appointment.presentators.filter(p => p.isSubstituted);
  const presentators = appointment.presentators.filter(p => !p.isSubstituted);
  const time = formatTimeRange(appointment.start, appointment.end)
  const [presentatorCardVisible, setPresentatorCardVisible] = useState(false);
  const handlePress = () => {
    setPresentatorCardVisible(!presentatorCardVisible);
  }
  return (
    presentatorCardVisible ? (<PresentatorAppointmentCard appointment={appointment} />) :
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={handlePress}>
          <Text style={styles.subjectName}>
            {appointment.subject.name}
          </Text>
          <Text style={[styles.timeText]}>
            {time}
          </Text>
          <Text style={styles.presentatorText}>
            {[...substitutedPresentators, ...presentators].map((p, index, array) => (
              <Fragment key={p.id}>
                <Text
                  style={[
                    styles.presentatorText,
                    substitutedPresentators.includes(p) && { textDecorationLine: 'line-through' }
                  ]}
                >
                  {p.name}
                </Text>
                {index < array.length - 1 && <Text>, </Text>}
              </Fragment>
            ))}
          </Text>

          <Text style={styles.roomText}>
            {appointment.rooms.map(r => r.name).join(' - ')}
          </Text>
          {appointment.isCancelled && (
            <Text style={styles.cancelledText}>ELMARAD</Text>
          )}
        </Pressable>

      </View>
  );
};

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
    fontWeight: 600,
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

export default memo(AppointmentCard);