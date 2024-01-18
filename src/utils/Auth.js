import { useEffect } from "react";
import vkApi from "./Api";

const Auth = () => {
  useEffect(() => {
    //получаем sign
    const configString = window.location.href;
    const url = new URL(configString);
    const params = url.searchParams;
    const signature = params.get("sign");

    const sendRequestToBackend = async (signature, vk_id, secretKey) => {
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

      const url = "https://valentine.itc-hub.ru/api/v1/createuser";
      const authString = getAuthString();

      const formData = new FormData();
      formData.append("vk_id", vk_id);

      const headers = {
        Authorization: authString,
        Sign: signature,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
        });

        if (response.ok) {
          console.log("User created successfully!");
        } else {
          console.error("Failed to create user:", response.statusText);
          if (response.status === 400) {
            console.log(await response.json());
          }
        }
      } catch (error) {
        console.error("Error creating user:", error.message);
      }
    };

    const fetchData = async () => {
      try {
        console.log("Fetching user info...");
        await vkApi.init();

        const userInfo = await vkApi.getUserInfo();
        const secretKey =
          process.env.REACT_APP_SECRET_KEY || "defaultSecretKey";
            // Отправка запроса на бэкенд для создания пользователя
            sendRequestToBackend(signature, userInfo.id, secretKey);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
};

export default Auth;
