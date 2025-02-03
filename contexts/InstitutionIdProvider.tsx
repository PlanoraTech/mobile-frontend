import { createContext, useContext, useState } from "react";

type InstitutionIdContextType = {
    institutionId: string;
    setInstitutionId: (institutionId: string) => void;
}

export const InstitutionIdContext = createContext<InstitutionIdContextType>({
    institutionId: '',
    setInstitutionId: () => {},
});

export const InstitutionIdProvider = ({ children }: { children: React.ReactNode }) => {
    const [institutionId, setInstitutionId] = useState('');

    return (
        <InstitutionIdContext.Provider value={{ institutionId, setInstitutionId }}>
            {children}
        </InstitutionIdContext.Provider>
    );
};

export const useInstitutionId = () => {
    return useContext(InstitutionIdContext);
};

