import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveId = async (key: string, id: string) => {
  try {
    await AsyncStorage.setItem(key, id.toString());
  } catch (error) {
    console.error('Hiba az id elmentése közben: ', error);
  }
};
