import { Fragment, useState } from "react";
import { StyleSheet, Pressable, View, Alert } from "react-native";
import { formatTimeRange } from "@/utils/dateUtils";
import { DropdownItem } from "./Dropdown";
import { DayOfWeek, SCREEN_WIDTH } from "@/constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,

} from 'react-native-reanimated';

import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';


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
  const theme = useTheme()

  const substitutedPresentators = appointment.presentators.filter(p => p.isSubstituted);
  const presentators = appointment.presentators.filter(p => !p.isSubstituted);
  const [optionsNotShown, setOptionsNotShown] = useState(true);
  const [isUpsent, setIsUpsent] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const expandProgress = useSharedValue(0);
  const time = formatTimeRange(appointment.start, appointment.end)

  const leftCardStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(
        expandProgress.value === 0
          ? SCREEN_WIDTH - 40
          : SCREEN_WIDTH / 2 - 40,
        { duration: 400 }
      ),
    };
  });

  const rightCardStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(
        expandProgress.value === 0
          ? 0
          : SCREEN_WIDTH / 2 - 40,
        { duration: 400 }
      ),
    };
  });

  const handlePress = () => {
    expandProgress.value = expandProgress.value === 0 ? 1 : 0;
    setOptionsNotShown(!optionsNotShown);
  };

  const handleSubstitution = () => {
    setDialogVisible(false)
    setIsUpsent(!isUpsent)

    //post substituted
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface },
          appointment.isCancelled && styles.cancelledCard,
          leftCardStyle
        ]}
      >
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
      </Animated.View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {
              dialogVisible && // after confirm isUpsent instantly changes causing misleading textchange while dialog is closing
              <Text>{ isUpsent  ?  "Jelenlét" : "Hiányzás"} megerősítése</Text>
            }

          </Dialog.Title>
          <Dialog.Actions>
            <Button mode="contained" onPress={() => setDialogVisible(false)}>Mégse</Button>
            <Button mode="contained" onPress={handleSubstitution}>Megerősítés</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Animated.View style={[rightCardStyle]}>
        <View style={styles.optionCard}>
          <Button
            buttonColor={isUpsent ? theme.colors.tertiary : theme.colors.secondary}
            onPress={() => setDialogVisible(true)}
            mode="contained" contentStyle={{
              height: '100%',
            }}>

            {isUpsent ? "Jelen leszek" : "Hiányozni fogok"}

          </Button>
        </View>
        <View style={styles.optionCard}>

          <Button onPress={console.log} mode="contained"
            contentStyle={{
              height: '100%',
            }} >
            Teremcsere
          </Button>
        </View>
      </Animated.View>
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
    marginLeft: 10,
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