
import { Fragment, useRef, useState } from "react";
import { Text, StyleSheet, Pressable, View, Alert, useColorScheme } from "react-native";
import { AppointmentModal } from "./AppointmentModal";
import { formatTimeRange } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeProvider";
import { getThemeStyles } from "@/assets/styles/themes";
import { DropdownItem } from "./Dropdown";
import { DayOfWeek, SCREEN_WIDTH } from "@/constants";
import Animated, { interpolate, runOnJS, SlideInRight, SlideOutRight, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { hide } from "expo-router/build/utils/splash";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";
import { RectButton } from 'react-native-gesture-handler'

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
  const [isModalVisible, setIsModalVisible] = useState(true);
  const substitutedPresentators = appointment.presentators.filter(p => p.isSubstituted);
  const presentators = appointment.presentators.filter(p => !p.isSubstituted);
  const [optionsNotShown, setOptionsNotShown] = useState(true);
  const leftViewWidth = useSharedValue(SCREEN_WIDTH - 40);
  const rightViewWidth = useSharedValue(0);
  const [isSubstituted, setIsSubstituted] = useState(false);
  const handlePress = () => {
    leftViewWidth.value = withTiming(optionsNotShown ? SCREEN_WIDTH - 40 : SCREEN_WIDTH / 2 - 40)
    rightViewWidth.value = withTiming(optionsNotShown ? 0 : SCREEN_WIDTH / 2 - 40)
    setOptionsNotShown(!optionsNotShown)
  }


  const handleSubstitution = () => {
    const alertType = isSubstituted ? "Jelenlét" : "Hiányzás"
    Alert.alert(
      `${alertType} megerősítése`,
      `${alertType} megerősítése a következő órához: ${appointment.subject.name}`,
      [
        {
          text: 'Mégse',
          onPress: () => { return },
          style: 'cancel'
        },
        {
          text: 'Megerősítés',
          onPress: () => setIsSubstituted(!isSubstituted)
        }
      ],
      {
        cancelable: true,
      }
    )
    //post substituted
  }

  return <View style={styles.container}>

    <Animated.View style={[{ width: leftViewWidth }, styles.card, themeStyles.content, appointment.isCancelled && styles.cancelledCard]}>


      <Pressable onPress={handlePress}>

        <Text style={[styles.subjectName, themeStyles.textSecondary]}>{appointment.subject.name}</Text>
        <Text style={[styles.timeText]}>
          {formatTimeRange(appointment.start, appointment.end)}
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
        <AppointmentModal isVisible={false} appointment={appointment} onClose={() => setIsModalVisible(false)} />


      </Pressable>
    </Animated.View>


    <Animated.View style={{ width: rightViewWidth }}>
      <RectButton
        onPress={handleSubstitution}
        style={[styles.optionCard, isSubstituted ? themeStyles.buttonTertiary : themeStyles.buttonSecondary]}
      >
        <Text numberOfLines={1} style={styles.optionText}>
          {isSubstituted ? "Jelen leszek" : "Hiányozni fogok"}
        </Text>
      </RectButton>

      <RectButton
        onPress={() => setIsModalVisible(true)}
        style={[styles.optionCard, themeStyles.button, appointment.isCancelled && styles.cancelledCard]}
      >
        <Text numberOfLines={1} style={styles.optionText}>Teremcsere</Text>
      </RectButton>
    </Animated.View>

  </View>

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
    alignItems: 'center',
    borderRadius: 8,

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