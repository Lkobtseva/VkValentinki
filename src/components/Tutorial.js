import React, { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Button,
  Progress,
} from "@vkontakte/vkui";
import "../styles/Tutorial.css";

const Tutorial = ({ id, go }) => {
  const [userCreated, setUserCreated] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const showSlides = async () => {
    try {
      const slides = [
        {
          media: {
            type: "image",
            blob: "data:image/png;base64,[IMAGE_DATA]",
          },
          title: 'Добро пожаловать в приложение "Валентинки"!',
          subtitle:
            "Создайте уникальные валентинки и отправляйте их своим друзьям.",
        },
        {
          media: {
            type: "image",
            blob: "data:image/png;base64,[IMAGE_DATA]",
          },
          title: "Что умеет приложение?",
          subtitle:
            "Приложение позволяет вам самостоятельно создавать валентинки, выбирать получателя и отправлять их анонимно или не анонимно.",
        },
        {
          media: {
            type: "image",
            blob: "data:image/png;base64,[IMAGE_DATA]",
          },
          title: "Начнем работу?",
          subtitle:
            "Создай валентинку и отправь своим друзьям.",
        },
      ];

      const { result } = await bridge.send("VKWebAppShowSlidesSheet", {
        slides,
      });

      if (result) {
        console.log("Slides are shown");
      }
    } catch (error) {
      console.error("Error showing slides:", error);
    }
  };

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
          setUserCreated(true);
          showSlides();
        } else {
          console.error("Failed to create user:", response.statusText);
          if (response.status === 400) {
            setUserCreated(false);
          }
        }
        setFetchCompleted(true);
      } catch (error) {
        console.error("Error creating user:", error.message);
      }
    };

    const fetchData = async () => {
      try {
        const userInfo = await bridge.send("VKWebAppGetUserInfo");
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

  if (!fetchCompleted) {
    return null;
  }
  go("main");
  return (
    <Panel id={id}>
      <PanelHeader>Валентинки</PanelHeader>
      <Group className="tutorial__block">
      </Group>
    </Panel>
  );
};
Tutorial.propTypes = {
  go: PropTypes.func,
};
export default Tutorial;
