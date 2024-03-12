import vkApi from "../utils/VkApi";
import useAuthString from "./useGetAuthString";
import CustomNotification from "../components/SendValentineSuccess";
import React from "react";
import ReactDOM from "react-dom";


const useSendValentine = (baseUrl) => {
    const { authString, signature } = useAuthString();

    const sendValentineToBackend = async (
        friendId,
        ValentineId,
        BackgroundId,
        message,
        isAnonymous
    ) => {
        if (!authString || !signature) {
            return;
        }
        const userInfo = vkApi.getUserId();
        const userSenderVkId = userInfo?.toString();
        try {
            const response = await fetch(`${baseUrl}/sendvalentine`, {
                method: "POST",
                headers: {
                    Authorization: authString,
                    Sign: signature,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_sender_vk_id: userSenderVkId,
                    user_recipient_vk_id: friendId,
                    valentine_id: ValentineId,
                    background_id: BackgroundId,
                    text: message,
                    anonim: isAnonymous,
                }),
            });

            if (response.ok) {
                const container = document.createElement("div");
                document.body.appendChild(container);
        
                const customNotification = (
                  <CustomNotification
                    onClose={() => {
                      ReactDOM.unmountComponentAtNode(container);
                      document.body.removeChild(container);
                    }}
                  />
                );
                ReactDOM.render(customNotification, container);
              } else {
                console.error("Ошибка при отправке данных на бэкенд");
              }
            } catch (error) {
              console.error("Ошибка при отправке данных на бэкенд:", error);
            }  
    };

    return sendValentineToBackend;
};

export default useSendValentine;
