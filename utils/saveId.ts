import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveInstitutionId = async (id: string) => {
  try {
    await AsyncStorage.setItem('institution', id.toString());
    console.log('Intézmény elmentve');
  } catch (error) {
    console.error('Hiba az id elmentése közben: ', error);
  }
  };
