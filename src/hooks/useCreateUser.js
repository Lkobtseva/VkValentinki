import bridge from "@vkontakte/vk-bridge";
import { slides } from "../utils/const";

const useCreateUser = (baseUrl) => {
    const sendRequestToBackend = async (
        signature,
        vk_id,
        secretKey,
        showSlides
    ) => {
        function getAuthString() {
            const VK_PREFIX = "vk_";
            const url = new URL(window.location.href);
            const params = url.searchParams;
            return params
                .toString()
                .split("&")
                .filter((p) => p.startsWith(VK_PREFIX))
                .sort()
                .join("&");
        }

        const fetchData = async () => {
            try {
                const userInfo = await bridge.send("VKWebAppGetUserInfo");
                if (userInfo.id) {
                    const secretKey =
                        process.env.REACT_APP_SECRET_KEY || "defaultSecretKey";
                    const authString = getAuthString();
                    const url = `${baseUrl}/createuser`;
                    const formData = new FormData();
                    formData.append("vk_id", userInfo.id);

                    const headers = {
                        Authorization: authString,
                        Sign: signature,
                    };

                    const response = await fetch(url, {
                        method: "POST",
                        headers,
                        body: formData,
                    });

                    if (response.ok) {
                        console.log("User created successfully!");
                        //showSlides();
                    } else {
                        console.error("Failed to create user:", response.statusText);
                        if (response.status === 400) {
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    };
    sendRequestToBackend();
};

export default useCreateUser;
