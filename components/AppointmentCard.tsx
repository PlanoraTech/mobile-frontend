
import { Fragment, useState } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { AppointmentModal } from "./AppointmentModal";
import { formatTime } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { DropdownItem } from "./Dropdown";
import { DayOfWeek } from "@/constants";


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

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const substitutedPresentators = appointment.presentators.filter(p => p.isSubstituted);
  const presentators = appointment.presentators.filter(p => !p.isSubstituted);
  return <Pressable onPress={() => setIsModalVisible(true)} style={[styles.appointmentCard, themeStyles.content, appointment.isCancelled && styles.cancelledCard]}>

    <Text style={[styles.subjectName, themeStyles.textSecondary]}>{appointment.subject.name}</Text>
    <Text style={[styles.timeText]}>
      {formatTime(appointment.start)} - {formatTime(appointment.end)}
    </Text>
    <Text style={[styles.presentatorText, themeStyles.text]}>
      {[...substitutedPresentators, ...presentators].map((p, index, array) => (
        <Fragment key={p.id}>
          <Text
            style={[
              styles.presentatorText,
              themeStyles.text,
              substitutedPresentators.includes(p) && { textDecorationLine: 'line-through' }
            ]}
          >
            {p.name}
          </Text>
          {index < array.length - 1 && <Text>, </Text>}
        </Fragment>
      ))}
    </Text>
    <Text style={[styles.roomText, themeStyles.text]}>
      {appointment.rooms.map(r => r.name).join(' - ')}
    </Text>
    {appointment.isCancelled && (
      <Text style={styles.cancelledText}>ELMARAD</Text>
    )}
    <AppointmentModal isVisible={isModalVisible} appointment={appointment} onClose={() => setIsModalVisible(false)} />
  </Pressable>
};

const styles = StyleSheet.create({
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
  appointmentCard: {
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