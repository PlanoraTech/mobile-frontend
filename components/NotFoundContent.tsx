
import { Text, StyleSheet } from "react-native"
import { useTheme, TouchableRipple } from "react-native-paper";

interface Props {
  message?: string;
  onPress?: () => void;
}

const NotFoundContent = ({ message, onPress }: Props) => {
  const theme = useTheme()

  return <TouchableRipple style={[styles.noSelectionContainer, { backgroundColor: theme.colors.background }]} rippleColor="rgba(0,0,0,0.32)" onPress={onPress}>
    <Text style={[styles.noSelectionText, { color: theme.colors.onSurface }]}>
      {message}
    </Text>
  </TouchableRipple>
}

export default NotFoundContent;

const styles = StyleSheet.create({
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
})