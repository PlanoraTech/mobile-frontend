import { LoadingSpinner } from "@/components/LoadingSpinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type InstitutionIdContextType = {
    institutionId: string;
    setInstitutionId: (institutionId: string) => void;
}

export const InstitutionIdContext = createContext<InstitutionIdContextType>({
    institutionId: '',
    setInstitutionId: () => { },
});

export const InstitutionIdProvider = ({ children }: { children: React.ReactNode }) => {
    const [institutionId, setInstitutionId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        AsyncStorage.getItem('institution').then((id: string | null) => {
            (id !== null) && setInstitutionId(id);
            setIsLoading(false);
        });
    }, []);


    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <InstitutionIdContext.Provider value={{ institutionId, setInstitutionId }}>
            {children}
        </InstitutionIdContext.Provider>
    );

};

export const useInstitutionId = () => {
    return useContext(InstitutionIdContext);
};

