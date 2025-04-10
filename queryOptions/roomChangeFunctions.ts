import { BASE_URL } from "@/constants";
import { SelectedTimetable } from "@/contexts/TimetableProvider";

 

export const fetchAvailableRooms = async (institutionId: string, token: string | undefined, appointmentId: string, selectedTimetable: SelectedTimetable) => {
    const response = await fetch(`${BASE_URL}/${institutionId}/${selectedTimetable.selectedView}/${selectedTimetable.selectedId}/appointments/${appointmentId}/rooms/available`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
    );
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Nincs jogosultságod a lekéréshez");
        }
        throw new Error("Ismeretlen hiba történt...");
    }

    return response.json();
};

export const confirmRoomSelection = async (institutionId: string, selectedRooms: any, token: string, appointmentId: string, selectedTimetable: SelectedTimetable) => {
    const response = await fetch(`${BASE_URL}/${institutionId}/${selectedTimetable.selectedView}/${selectedTimetable.selectedId}/appointments/${appointmentId}/rooms`, {
        method: 'PATCH',
        body: JSON.stringify(selectedRooms),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    console.log("response", await response.text());
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Nincs jogosultságod a művelethez");
        }
        if (response.status === 400) {
            throw new Error("Hibás kérés");
        }
        throw new Error("Ismeretlen hiba történt...");
    }
};