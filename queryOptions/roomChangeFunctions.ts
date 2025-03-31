import { BASE_URL } from "@/constants";

export const fetchAvailableRooms = async (institutionId: string, token: string | undefined) => {
    const response = await fetch(`${BASE_URL}/${institutionId}/rooms/available`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
    );
    console.log(await response.text());
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Nincs jogosultságod a lekéréshez");
        }
        throw new Error("Ismeretlen hiba történt...");
    }

    return response.json();
};

export const confirmRoomSelection = async (institutionId: string, selectedRooms: any, token: string) => {
    const response = await fetch(`${BASE_URL}/${institutionId}/rooms`, {
        method: 'POST',
        body: JSON.stringify(selectedRooms),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Nincs jogosultságod a művelethez");
        }
        if (response.status === 400) {
            throw new Error("Hibás kérés");
        }
        throw new Error("Ismeretlen hiba történt...");
    }

    return response.json();
};