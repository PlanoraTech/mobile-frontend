
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper";

const NotFoundContent = () => {
  const theme = useTheme()
  return <View style={[styles.noSelectionContainer, { backgroundColor: theme.colors.surface }]}>
    <Text style={[styles.noSelectionText, { color: theme.colors.onSurface }]}>
      Válassz órarendet, előadót vagy termet a beállítások gombbal
    </Text>
  </View>
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