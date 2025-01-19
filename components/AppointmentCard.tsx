import { Appointment } from "@/types";
import { View, Text, StyleSheet } from "react-native";

interface AppointmentCardProps {
    appointment: Appointment;
    formatTime: (dateString: string) => string;
  }
  
export const AppointmentCard = ({ appointment, formatTime }: AppointmentCardProps) => (
    <View style={[styles.appointmentCard, appointment.isCancelled && styles.cancelledCard]}>
      <Text style={styles.subjectName}>{appointment.subject.name}</Text>
      <Text style={styles.timeText}>
        {formatTime(appointment.start)} - {formatTime(appointment.end)}
      </Text>
      <Text style={styles.presentatorText}>
        {appointment.presentators.map(p => p.name).join(', ')}
      </Text>
      <Text style={styles.roomText}>
        {appointment.rooms.map(r => r.name).join(' - ')}
      </Text>
      {appointment.isCancelled && (
        <Text style={styles.cancelledText}>ELMARAD</Text>
      )}
    </View>
  );
  
  const styles = StyleSheet.create({
    cancelledText: {
        color: '#ff3b30',
        fontWeight: '600',
        fontSize: 12,
        marginTop: 5,
    },
    cancelledCard: {
        opacity: 0.7,
        backgroundColor: '#f8f8f8',
    },
    roomText: {
        fontSize: 14,
        color: '#666666',
    },
    presentatorText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 3,
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
    timeText: {
        fontSize: 14,
        color: '#0066cc',
        marginBottom: 5,
    },
    subjectName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 5,
    },
  });