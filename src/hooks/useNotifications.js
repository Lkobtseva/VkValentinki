import { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import vkApi from "../utils/VkApi";
import useAuthString from "./useGetAuthString";

const useNotifications = (baseUrl) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [profileDataLoaded, setProfileDataLoaded] = useState(false);
    const { authString, signature } = useAuthString();

    useEffect(() => {
        const getNotificationStatus = async () => {
            try {
                if (!authString || !signature) {
                    return;
                }

                const userInfo = await vkApi.getUserInfo(authString);
                const userSenderVkId = userInfo?.id.toString();

                const response = await fetch(`${baseUrl}/getnotifications`, {
                    method: "POST",
                    headers: {
                        Authorization: authString,
                        Sign: signature,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vk_id: userSenderVkId,
                    }),
                });

                const data = await response.json();
                if (data.status === null) {
                    setNotificationsEnabled(false);
                } else {
                    setNotificationsEnabled(data.status);
                }
            } catch (error) {
                console.error("Error getting notification status:", error);
            }
        };

        const checkTokenStatus = async () => {
            try {
                await getNotificationStatus();
                setProfileDataLoaded(true);
            } catch (error) {
                console.error("Error checking token status:", error);
            }
        };

        checkTokenStatus();
    }, [baseUrl, authString, signature]);

    const setNotificationStatus = async (status) => {
        try {
            const userInfo = await vkApi.getUserInfo(authString);
            const userSenderVkId = userInfo?.id.toString();

            const response = await fetch(`${baseUrl}/setnotifications`, {
                method: "POST",
                headers: {
                    Authorization: authString,
                    Sign: signature,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vk_id: userSenderVkId,
                    status: status ? "1" : "0",
                }),
            });

            const data = await response.json();
            if (data.status === "save") {
                console.log("Notification status saved successfully.");
            } else {
                console.error("Failed to save notification status.");
            }
        } catch (error) {
            console.error("Error setting notification status:", error);
        }
    };

    const handleNotificationsToggle = async () => {
        try {
            if (notificationsEnabled) {
                setNotificationsEnabled(false);
                setNotificationStatus(false);
            } else {
                const permissionGranted = await vkApi.requestNotificationsPermission();
                if (permissionGranted) {
                    setNotificationsEnabled(true);
                    setNotificationStatus(true);
                } else {
                    console.log("User denied notification permission");
                }
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            setNotificationsEnabled(false);
            setNotificationStatus(false);
        }
    };

    return {
        notificationsEnabled,
        handleNotificationsToggle,
        profileDataLoaded,
    };
};

export default useNotifications;
