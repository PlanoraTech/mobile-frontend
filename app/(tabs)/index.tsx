import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { saveId } from "@/utils/saveId";
import { router } from 'expo-router';
import DropdownComponent from "@/components/Dropdown";
import { DropdownData } from "@/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BASE_URL } from "@/utils/baseUrl";

export default function Index() {


  const { user } = useAuth();
  const [institutions, setInstitutions] = useState([] as DropdownData[]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error('Nem sikerült betölteni az intézményeket:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInstitutions();
  }, [user?.accessToken]);



  const handlePress = async (id: string, access: string) => {
    console.log('access:', access);
    try {
      if (access === 'PUBLIC') {
        const response = await fetch(`${BASE_URL}/${id}`);
        const data: DropdownData = await response.json();
        if (!data) {
          throw new Error('Nem található az intézmény!');
        }
        saveId('institution', id.toString());
        router.navigate(`/institution?inst=${id}`);
      } else {
        if (user?.accessToken) {
          const response = await fetch(`${BASE_URL}/${id}`, {
            headers: {
              'Authorization': `Bearer ${user.accessToken}`
            }
          });
          const data = await response.json();
        } else {
          router.navigate({ pathname: '/login', params: { inst: id } });
        }
      }
    } catch (error) {
      console.error('Hiba az intézmények betöltése során:', error);
    }
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DropdownComponent
          data={institutions}
          label="Intézmény"
          placeholder="Válassz intézményt"
          onSelect={(item) => handlePress(item.id, item.access )}
          searchPlaceholder=""
        />
      )}
  
      <View style={styles.linksContainer}>
        <Link href="../login" style={styles.link}>
          <Text style={styles.linkText}>Bejelentkezés</Text>
        </Link>
        <Link href="../register" style={[styles.link, styles.registerLink]}>
          <Text style={styles.linkText}>Regisztráció</Text>
        </Link>
      </View>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
      paddingTop: 40,
      justifyContent: 'space-between',
    },
    linksContainer: {
      width: '100%',
      gap: 12,
      marginBottom: 40,
    },
    link: {
      backgroundColor: '#2563eb', 
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    linkText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    registerLink: {
      backgroundColor: '#1d4ed8',
    },
  });