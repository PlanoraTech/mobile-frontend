import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface InstitutionContextType {
    id: string;
}

const InstitutionContext = createContext<InstitutionContextType | null>(null);

const InstitutionProvider = ({ children }: { children: React.ReactNode }) => {
    const [id, setId] = useState("");

    useEffect(() => {
        const getInstitutionId = async () => {
            try {
                const storedId = await AsyncStorage.getItem('institution');
                setId(storedId || '');
            } catch (error) {
                console.error('Hiba az intézmények betöltése során: ', error);
                setId('');
            }
        };
        getInstitutionId();
    }, []);

    return (
        <InstitutionContext.Provider value={{ id }}>
            {children}
        </InstitutionContext.Provider>
    );
}

export const useInstitution = () => {
    const context = useContext(InstitutionContext);
    if (!context) {
        throw new Error();
    }
    return context;
}

export { InstitutionProvider };