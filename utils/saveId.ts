import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveInstitutionId = async (id: string) => {
    try {
      // Get existing data
      const existingData = await AsyncStorage.getItem('institution');
      let institutionArray = existingData ? JSON.parse(existingData) : [];
  
      // Add new id to the array
      institutionArray.push(id.toString());
  
      // Save updated array
      await AsyncStorage.setItem('institution', JSON.stringify(institutionArray));
      console.log('Institution ID saved successfully');
    } catch (error) {
      console.error('Error saving institution ID:', error);
    }
  };
  