import { useEffect, useState } from "react";
import useAuthString from "./useGetAuthString";

const useSentValentines = (vkApi, baseUrl) => {
    const [sentValentines, setSentValentines] = useState([]);
    const { signature, authString } = useAuthString();

    const fetchData = async () => {
        try {
            if (!authString || !signature) {
                return;
            }
            const userInfo = await vkApi.getUserInfo();
            const userSenderVkId = userInfo.id.toString();
            const response = await fetch(`${baseUrl}/getvalentinesend`, {
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
            setSentValentines(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [authString, signature]);

    return { sentValentines, fetchData };
};

export default useSentValentines;
