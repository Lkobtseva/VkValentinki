// useFriendToken.js
import { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import vkApi from "../utils/VkApi";
import useAuthString from "../hooks/useGetAuthString";

const useFriendsToken = (baseUrl) => {
    const [accessGranted, setAccessGranted] = useState(false);
    const { signature, authString } = useAuthString();

    const grantAccess = async () => {
        try {
            if (!accessGranted) {
                const permissionGranted = await vkApi.requestFriendsPermission();
                const token = vkApi.getToken();
                if (permissionGranted) {
                    setAccessGranted(true);
                    setFriendsToken(token, true);
                } else {
                    setAccessGranted(false);
                }
            }
        } catch (error) {
            console.error("Error granting access to friends list:", error);
        }
    };

    //useEffect(() => {
    const setFriendsToken = async (token, status) => {
        const userInfo = await bridge.send("VKWebAppGetUserInfo");
        const userSenderVkId = userInfo?.id.toString();
        try {
            const response = await fetch(`${baseUrl}/setfriendtoken`, {
                method: "POST",
                headers: {
                    Authorization: authString,
                    Sign: signature,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vk_id: userSenderVkId,
                    friend_token: status ? "1" : "0",
                    friend_token_text: token,
                }),
            });

            const data = await response.json();
            if (data.status === "save") {
                console.log("Friends token status saved successfully.");
                setAccessGranted(true);
            } else {
                console.error("Failed to save friends token status:", data.error);
                setAccessGranted(false);
            }
        } catch (error) {
            console.error("Error setting friends token:", error);
        }
    };

    const getFriendsTokenStatus = async () => {
        const userInfo = await bridge.send("VKWebAppGetUserInfo");
        const userSenderVkId = userInfo?.id.toString();
        try {
            const response = await fetch(`${baseUrl}/getfriendtoken`, {
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
            if (data.friend_token === false) {
                setAccessGranted(false);
            } else {
                setAccessGranted(true);
            }
        } catch (error) {
            console.error("Error getting friends token status:", error);
        }
    };

    getFriendsTokenStatus();
    grantAccess();

    //}, [authString, baseUrl, signature, accessGranted]);

    return { accessGranted, grantAccess };
};

export default useFriendsToken;
