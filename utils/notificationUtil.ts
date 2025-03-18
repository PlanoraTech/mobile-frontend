import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { BASE_URL_AUTH } from '@/constants';

export async function registerForPushNotifications(userToken: string): Promise<boolean> {
    if (!Device.isDevice) {
        console.log("Push notifications are only available on physical devices");
        return false;
    }

    try {

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Permission not granted for push notifications");
            return false;
        }


        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
        });


        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }


        const response = await fetch(`${BASE_URL_AUTH}/notifications/register-token/?token=${userToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify({
                token: token.data,
            }),
        });

        if (!response.ok) {
            console.error("Failed to register token on server");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error registering for push notifications:", error);
        return false;
    }
}
export async function unsubscribeFromPushNotifications(userToken: string): Promise<boolean> {

    if (!Device.isDevice) {
        console.log("Push notifications are only available on physical devices");
        return false;
    }

    try {

        const currentPermission = await Notifications.getPermissionsAsync();


        if (currentPermission.status !== "granted") {
            console.log("No push notification permissions to revoke");
            return true;
        }

        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
        });


        const response = await fetch(`${BASE_URL_AUTH}/notifications/delete-token/?token=${userToken}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify({
                token: token.data
            }),
        });

        if (!response.ok) {
            console.error("Failed to unregister push token on server");
            return false;
        }


        if (Platform.OS === "ios") {
            alert("Please disable notifications for this app in your iOS Settings");
        }

        if (Platform.OS === "android") {
            await Notifications.deleteNotificationChannelAsync("default");
        }

        console.log("Successfully unsubscribed from push notifications");
        return true;

    } catch (error) {
        console.error("Error unsubscribing from push notifications:", error);
        return false;
    }
}

export const isSubscribedToNotifications = async (userToken: string): Promise<boolean> => {
    if (!Device.isDevice) return false;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return false;

    const token = await Notifications.getExpoPushTokenAsync();
    try {
        const response = await fetch(`${BASE_URL_AUTH}/notifications/check-token/?token=${userToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify({
                token: token.data,
            }),
        });
        const responseText = await response.text();
        return responseText === "true";
    } catch (error) {
        console.error("Error checking token on server:", error);
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
