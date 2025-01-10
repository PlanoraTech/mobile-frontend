import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { FlatList, Pressable } from "react-native";
import { saveInstitutionId } from "@/utils/saveId";
import { router } from 'expo-router';

interface Todo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

interface Institution {
  id: number,
  name: string,
  access: 'private' | 'public',
}

export default function Index() {
  const api = 'http://192.168.1.2:3000/api/institutions/';
  
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch(api);
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error('Nem sikerült betölteni az intézményeket:', error);
      }
    }
    fetchInstitutions();
  }, [user?.accessToken]);

  const filteredInstitutions = searchString === "" 
    ? []
    : institutions.filter(institution => 
        institution.name.toLowerCase().includes(searchString.toLowerCase())
      ).map(institution => {
        const lowerTitle = institution.name.toLowerCase();
        const lowerSearch = searchString.toLowerCase();
        const index = lowerTitle.indexOf(lowerSearch);
        
        return {
          ...institution,
          title: (
            <Text>
              {institution.name.slice(0, index)}
              <Text style={{ fontWeight: 'bold' }}>
                {institution.name.slice(index, index + searchString.length)}
              </Text>
              {institution.name.slice(index + searchString.length)}
            </Text>
          )
        };
      });

  const handlePress = async (id: number, access: string) => {
    try {
      if (access === 'public') {
        const response = await fetch(api+ id);
        const data: Institution = await response.json();
        if (!data) {
          throw new Error('Nem található az intézmény!');
        }
        saveInstitutionId(id.toString());
        router.push(`/timetable?inst=${id}`);
      } else {
        if (user?.accessToken) {
          const response = await fetch(api + id, {
            headers: {
              'Authorization': `Bearer ${user.accessToken}`
            }
          });
          const data = await response.json();
          console.log(data);
        } else {
          console.log('Nincs jogosultságod az intézmény megtekintéséhez!');
        }
      }
    } catch (error) {
      console.error('Error fetching institution:', error);
    }
  }

  return (
    <View>
    <TextInput
      value={searchString}
      onChangeText={setSearchString}
      placeholder="Intézmény neve..."
    />
    <FlatList 
      data={filteredInstitutions} 
      style={styles.list}
      renderItem={({ item }) => (
        <Pressable onPress={()=>handlePress(item.id, item.access)} style={styles.institutionContainer}>
          <Text>
            {item.name}
          </Text>
        </Pressable>
      )}
      keyExtractor={item => item.id.toString()} 
    />
    <Link href="../login">Bejelentkezés</Link>
    <Link href="../register">Regisztráció</Link>
  </View>
  )
}

const styles = StyleSheet.create({
  institutionContainer: {
    height: 50,
    borderWidth: 1,
    margin: 1,
    borderRadius: 5,
    paddingLeft: 10,
    justifyContent: "center"
  },
  list: {
    maxHeight: 207
  }
})