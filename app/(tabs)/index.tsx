import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "@/contexts/AuthProvider";
import { Institution } from "../types/Institution";

export default function Index() {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchString, setSearchString] = useState("");
  
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const headers: HeadersInit = user?.accessToken 
          ? { 'Authorization': `Bearer ${user.accessToken}` }
          : {};

        const response = await fetch('localhost:3000/institutions', { headers });
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error('Nem sikerült betölteni az intézményeket:', error);
      }
    }
    fetchInstitutions();
  }, [user?.accessToken]); 

  const filteredInstitutions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <View>
      <TextInput 
        value={searchString} 
        onChangeText={setSearchString}
        placeholder="Intézmény neve..." 
      />
      {filteredInstitutions.map(institution => (
        <Text key={institution.id}>{institution.name}</Text>
      ))}
      <Link href="../login">Bejelentkezés</Link>
      <Link href="../register">Regisztráció</Link>
    </View>
  );
}