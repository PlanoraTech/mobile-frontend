import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { Institution } from "../../types/Institution";
import { FlatList, Pressable } from "react-native";

interface Todo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

export default function Index() {
  
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState<Todo[]>([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const headers: HeadersInit = user?.accessToken
          ? { 'Authorization': `Bearer ${user.accessToken}` }
          : {};

        const response = await fetch('https://jsonplaceholder.typicode.com/todos', { headers });
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
        institution.title.toLowerCase().includes(searchString.toLowerCase())
      ).map(institution => {
        const lowerTitle = institution.title.toLowerCase();
        const lowerSearch = searchString.toLowerCase();
        const index = lowerTitle.indexOf(lowerSearch);
        
        return {
          ...institution,
          title: (
            <Text>
              {institution.title.slice(0, index)}
              <Text style={{ fontWeight: 'bold' }}>
                {institution.title.slice(index, index + searchString.length)}
              </Text>
              {institution.title.slice(index + searchString.length)}
            </Text>
          )
        };
      });

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
        <Pressable style={styles.institutionContainer}>
          <Text>
            {item.title}
          </Text>
        </Pressable>
      )}
      keyExtractor={item => item.id.toString()} 
    />
    <Link href="../login">Bejelentkezés</Link>
    <Link href="../register">Regisztráció</Link>
  </View>
  );
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