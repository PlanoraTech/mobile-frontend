import { Institution } from "@/types";
import { Pressable, Text, StyleSheet } from "react-native";

interface InstitutionHeaderProps {
    institution: Institution;
    onPress: () => void;
}

export const InstitutionHeader = ({ institution, onPress }: InstitutionHeaderProps) => (
    <Pressable onPress={onPress}>
        <Text style={[styles.institutionName, { color: institution.color }]}>
            {institution.name}
        </Text>
    </Pressable>
);

const styles = StyleSheet.create({
    institutionName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 16,
    },
});