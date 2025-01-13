import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { saveInstitutionId } from "@/utils/saveId";
import { router } from 'expo-router';
import DropdownComponent from "@/components/Dropdown";
import { Institution } from "@/types/Institution";

export default function Index() {
  const api = 'http://localhost:3000/institutions/';
  
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);

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

 

  const handlePress = async (id: string, access: string) => {
    try {
      if (access === 'public') {
        const response = await fetch(api + id);
        const data: Institution = await response.json();
        if (!data) {
          throw new Error('Nem található az intézmény!');
        }
        saveInstitutionId(id.toString());
        router.push(`/institution?inst=${id}`);
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
          
        }
      }
    } catch (error) {
      console.error('Hiba az intézmények betöltése során:', error);
    }
  }

  return (
    <View>
      <DropdownComponent 
        data={institutions}
        label="Intézmény"
        placeholder="Válassz intézményt"
        onSelect={(item) => handlePress(item.id, item.access || 'public')} searchPlaceholder={""}      />
      <Link href="../login">Bejelentkezés</Link>
      <Link href="../register">Regisztráció</Link>
    </View>
  );
}

const styles = StyleSheet.create({

})