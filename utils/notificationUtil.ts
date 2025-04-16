import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { BASE_URL_AUTH } from '@/constants';
export async function registerForPushNotifications(userToken: string): Promise<boolean> {
    if (!Device.isDevice) {
        return false;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (Platform.OS === "android" && existingStatus === "granted") {
            await Notifications.deleteNotificationChannelAsync("default");
        }
        
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            return false;
        }

        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });

        const tokenId = token.data.startsWith('ExponentPushToken[') && token.data.endsWith(']') 
            ? token.data.slice(18, -1) 
            : token.data;

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        const response = await fetch(`${BASE_URL_AUTH}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                expoPushToken: tokenId,
            }),
        });

        console.log("Extracted token ID:", tokenId);
        
        if (!response.ok && response.status !== 409) {
            const responseText = await response.text();
            console.log("Error response from server:", responseText);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error registering for push notifications:", error);
        return false;
    }
}



export const isSubscribedToNotifications = async (): Promise<boolean> => {
    if (!Device.isDevice) return false;
    
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return false;
    
    if (Platform.OS === "android") {
        try {
            const channel = await Notifications.getNotificationChannelAsync("default");
            if (!channel || channel.importance === Notifications.AndroidImportance.NONE) {
                return false;
            }
        } catch (error) {
            console.log("Error checking notification channel:", error);
            return false;
        }
    }

    return false;
};

export const getCurrentNotificationPermission = async () => {
    if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        return status;
    }
    return "undetermined";
};