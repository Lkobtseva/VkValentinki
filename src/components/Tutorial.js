import React, { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Button,
  Progress,
} from "@vkontakte/vkui";
import "../styles/Tutorial.css";

const Tutorial = ({ id, tutorialStep, nextTutorialStep, go }) => {
  const [userCreated, setUserCreated] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

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
          setUserCreated(false);
        } else {
          console.error("Failed to create user:", response.statusText);
          if (response.status === 400) {
            setUserCreated(true);
          }
        }
        setFetchCompleted(true);
      } catch (error) {
        console.error("Error creating user:", error.message);
      }
    };

    const fetchData = async () => {
      try {
        // await vkApi.init();

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

  const renderTutorialContent = () => {
    if (!userCreated) {
      switch (tutorialStep) {
        case 1:
          return (
            <Div>
              <h2>Добро пожаловать в приложение "Валентинки"!</h2>
              <p>
                Создайте уникальные валентинки и отправляйте их своим друзьям.
              </p>
            </Div>
          );
        case 2:
          return (
            <Div>
              <h2>Что умеет приложение?</h2>
              <p>
                Приложение позволяет вам самостоятельно создавать валентинки,
                выбирать получателя и отправлять их анонимно или не анонимно.
              </p>
            </Div>
          );
        case 3:
          return (
            <Div
              style={{
                maxWidth: "200px",
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              <h2 style={{ paddingLeft: "5px" }}>Начнем работу!</h2>
              <Button
                className="tutorial__button"
                style={{
                  color: "white",
                  backgroundColor: "#FF3347",
                }}
                size="l"
                onClick={() => go("main")}
                data-to="main"
              >
                Создать валентинку
              </Button>
            </Div>
          );
        default:
          return null;
      }
    } else {
      return (
        <Div
          style={{ maxWidth: "200px", marginRight: "auto", marginLeft: "auto" }}
        >
          <Div className="hello__icon"></Div>
          <Button
            className="tutorial__button"
            style={{
              color: "white",
              backgroundColor: "#FF3347",
            }}
            size="l"
            onClick={() => go("main")}
            data-to="main"
          >
            Создать валентинку
          </Button>
        </Div>
      );
    }
  };

  return (
    <Panel id={"tutorial"}>
      <PanelHeader>Valentinki</PanelHeader>
      <Group className="tutorial__block">
        {renderTutorialContent()}
        {!userCreated && <Progress value={tutorialStep * 30} max={90} />}
        {!userCreated && tutorialStep < 3 && (
          <Div>
            <Button
              className="tutorial__button"
              style={{
                color: "white",
                backgroundColor: "#FF3347",
              }}
              size="l"
              onClick={nextTutorialStep}
            >
              Далее
            </Button>
          </Div>
        )}
      </Group>
    </Panel>
  );
};

export default Tutorial;
