import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface InstitutionContextType {
    ids: number[] | null;
}

const InstitutionContext = createContext<InstitutionContextType | null>(null);

const InstitutionProvider = ({ children }: { children: React.ReactNode }) => {
    const [ids, setIds] = useState<number[] | null>(null);

    useEffect(() => {
        const getInstitutionIds = async () => {
            try {
                const storedIds = await AsyncStorage.getItem('institutionIds');
                setIds(storedIds ? JSON.parse(storedIds).map(Number) : null);
            } catch (error) {
                console.error('Hiba az intézmények betöltése során: ', error);
                setIds(null);
            }
        };
        getInstitutionIds();
    }, []);

    return (
        <InstitutionContext.Provider value={{ ids }}>
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