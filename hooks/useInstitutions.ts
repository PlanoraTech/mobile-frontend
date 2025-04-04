import { BASE_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";

const fetchInstitutions = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Hiba az intézmények betöltése során.');
    }
    return await response.json();
}

export const useInstitutions = () => {
    return useQuery({
        queryKey: ['institutions'],
        queryFn: fetchInstitutions
    });
}