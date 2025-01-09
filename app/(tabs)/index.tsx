import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function Index() {
  const [pubInstitutions, setPubInstitutions] = useState()
  const [privInstitutions, setPrivInstitutions] = useState()
  const [searchString, setSearchString] = useState("");
  useEffect(()=> {
    
  })
  return (
    <View>
      <TextInput value={searchString } onChangeText={text => setSearchString(text)} placeholder="Intézmény neve..." />
       <Link href="../login" > Bejelentkezés</Link>
       <Link href="../register" > Regisztráció</Link>
    </View>
  );
}
