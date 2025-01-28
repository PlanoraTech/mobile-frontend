import DropdownComponent from "@/components/Dropdown";
import { useState } from "react";
import { Modal, Pressable, View, Text } from "react-native";

export default function test() {
    const [isVisible, setIsVisible] = useState(false)
    return <View style={{marginTop: 30}}>

    <Pressable onPress={()=>setIsVisible(true)}>
        <Text>Gomb</Text>
    </Pressable>
    {isVisible?
    <Modal>

    <View style={{marginTop: 600}}>
        <DropdownComponent data={[
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
            {id: "1", name: "asd"},
        ]} placeholder={""} searchPlaceholder={""} label={""} onSelect={function (item: any): void {
            throw new Error("Function not implemented.");
        } }></DropdownComponent>
    </View>
        </Modal> : null
    }
        </View>
}