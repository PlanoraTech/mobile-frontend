import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { saveInstitutionId } from "@/utils/saveId";
import { router } from 'expo-router';
import DropdownComponent from "@/components/Dropdown";
import { Institution } from "@/types/Institution";

export default function Index() {
  const api = 'http://192.168.1.2:3000/api/institutions/';
  
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

 

  const handlePress = async (id: number, access: string) => {
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
          console.log('Nincs jogosultságod az intézmény megtekintéséhez!');
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
        placeholder="Válassz intézményt"
        label="Intézmény"
        onSelect={(item) => handlePress(Number(item.id), item.access || 'public')}
      />
      <Link href="../login">Bejelentkezés</Link>
      <Link href="../register">Regisztráció</Link>
    </View>
  );
}

const styles = StyleSheet.create({

})