import { React, useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Avatar,
  Header,
  Button,
  Switch,
  Separator,
} from "@vkontakte/vkui";
import "../styles/main.css";
import navIcon1 from "../images/nav1.svg";
import navIcon2 from "../images/nav2.svg";
import Navigator from "./Navigator";
import vkApi from "../utils/Api";

const MainScreen = ({ go }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [user, setUser] = useState({});
  const [profileAccessGranted, setProfileAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  // Функция для получения статуса токена при монтировании компонента
  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        // Получение ID отправителя
        const userInfo = await bridge.send("VKWebAppGetUserInfo");
        await getDefaultTokenStatus(userInfo.id);
        getNotificationStatus();
        setLoading(false);
      } catch (error) {
        console.error("Error checking token status:", error);
      }
    };
    checkTokenStatus();
  }, []);

  // Инициализация пользователя и проверка доступа к профилю
  const grantProfileAccess = async () => {
    try {
      const profilePermissionGranted = await vkApi.init();
      if (profilePermissionGranted) {
        console.log("Access granted");
        setProfileAccessGranted(true);
        await setDefaultToken(true);
      } else {
        console.log("Access denied");
        setProfileAccessGranted(false);
      }
    } catch (error) {
      console.error("Error granting access to profile:", error);
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        await vkApi.init();
        const userInfo = await vkApi.getUserInfo();
        setUser(userInfo);
        setUserLoading(false);
      } catch (error) {
        console.error("Error loading userInfo:", error);
      }
    }

    if (profileAccessGranted) {
      loadUser();
    }
  }, [profileAccessGranted]);

  //установка статуса общего токена и сохранение его на бэке
  const setDefaultToken = async (status) => {
    //получение необходимых данных для запросов
    const configString = window.location.href;
    const url = new URL(configString);
    const params = url.searchParams;
    const signature = params.get("sign");

    //получаем AuthString
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
    const authString = getAuthString();

    // Получение ID отправителя
    const userInfo = await bridge.send("VKWebAppGetUserInfo");
    const userSenderVkId = userInfo?.id.toString();
    try {
      const response = await fetch(
        "https://valentine.itc-hub.ru/api/v1/setdefaulttoken",
        {
          method: "POST",
          headers: {
            Authorization: authString,
            Sign: signature,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vk_id: userSenderVkId,
            default_token: status ? "1" : "0",
          }),
        }
      );

      const data = await response.json();
      if (data.status === "save") {
        setProfileAccessGranted(true);
        console.log("Default tooken status saved successfully.");
      } else {
        setProfileAccessGranted(false);
        console.error("Failed to save default token status.");
      }
    } catch (error) {
      console.error("Error setting default token:", error);
    }
  };

  //берем статус токена с бэка
  const getDefaultTokenStatus = async () => {
    //получение необходимых данных для запросов
    const configString = window.location.href;
    const url = new URL(configString);
    const params = url.searchParams;
    const signature = params.get("sign");

    //получаем AuthString
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
    const authString = getAuthString();

    // Получение ID отправителя
    const userInfo = await bridge.send("VKWebAppGetUserInfo");
    const userSenderVkId = userInfo.id.toString();
    try {
      const response = await fetch(
        "https://valentine.itc-hub.ru/api/v1/getdefaulttoken",
        {
          method: "POST",
          headers: {
            Authorization: authString,
            Sign: signature,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vk_id: userSenderVkId,
          }),
        }
      );

      const data = await response.json();
      if (data.default_token === false) {
        setProfileAccessGranted(false);
      } else {
        setProfileAccessGranted(true);
      }
    } catch (error) {
      console.error("Error getting default token status:", error);
    }
  };

  //установка статуса уведомлений - вкл или выкл
  const setNotificationStatus = async (status) => {
    //получение необходимых данных для запросов
    const configString = window.location.href;
    const url = new URL(configString);
    const params = url.searchParams;
    const signature = params.get("sign");

    //получаем AuthString
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
    const authString = getAuthString();

    // Получение ID отправителя
    const userInfo = await vkApi.getUserInfo();
    const userSenderVkId = userInfo?.id.toString();
    try {
      const response = await fetch(
        "https://valentine.itc-hub.ru/api/v1/setnotifications",
        {
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
        }
      );

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

  // Функция для получения статуса уведомлений с бэкенда
  const getNotificationStatus = async () => {
    //получение необходимых данных для запросов
    const configString = window.location.href;
    const url = new URL(configString);
    const params = url.searchParams;
    const signature = params.get("sign");

    //получаем AuthString
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
    const authString = getAuthString();

    // Получение ID отправителя
    const userInfo = await bridge.send("VKWebAppGetUserInfo");
    const userSenderVkId = userInfo.id.toString();
    try {
      const response = await fetch(
        "https://valentine.itc-hub.ru/api/v1/getnotifications",
        {
          method: "POST",
          headers: {
            Authorization: authString,
            Sign: signature,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vk_id: userSenderVkId,
          }),
        }
      );

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

  // Обработчик переключения уведомлений
  async function handleNotificationsToggle() {
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
  }

  return (
    <Panel id="main">
      <PanelHeader>Valentinki</PanelHeader>

      {/* Блок запроса доступа к профилю */}
      {!profileAccessGranted && !loading && (
        <Div
          style={{
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              maxWidth: "325px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Нам нужен доступ к вашему профилю.
          </p>
          <Button
            className="access__button"
            style={{
              maxWidth: "200px",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#ff3347",
            }}
            onClick={grantProfileAccess}
          >
            Предоставить доступ
          </Button>
        </Div>
      )}

      {/* Блок профиля, уведомлений и навигационных кнопок */}
      {profileAccessGranted && !userLoading && (
        <>
          {/* Блок профиля */}
          <Group>
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "0",
              }}
            >
              <Div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  style={{ border: "2px solid #FF3347" }}
                  src={user && user.photo_200}
                  size={80}
                />
                <Div style={{ marginLeft: 8, paddingLeft: 0 }}>
                  <Header level={5}>{`${user && user.first_name} ${
                    user && user.last_name
                  }`}</Header>
                </Div>
              </Div>
            </Div>
            <Separator style={{ display: "none" }} />
          </Group>

          {/* Блок уведомлений */}
          <Group>
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "175px",
              }}
            >
              <Div style={{ display: "flex", flexDirection: "column" }}>
                <Header style={{ paddingLeft: "0" }}>Уведомления</Header>
                <span
                  style={{ color: "grey", paddingLeft: "0", fontSize: "14px" }}
                >
                  О приходе новой валентинки
                </span>
              </Div>
              <Switch
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
              />
            </Div>
          </Group>

          {/* Навигационные кнопки */}
          <Div style={{ padding: 0 }}>
            <Group
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Отправленные валентинки */}
              <Div
                className="nav__button"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  paddingLeft: "30px",
                  justifyContent: "flex-start",
                }}
                size="l"
                onClick={() => go("SentValentines", "sent")}
              >
                <Div style={{ paddingLeft: "0px" }}>
                  <img
                    style={{
                      maxHeight: "25px",
                      paddingTop: "2px",
                    }}
                    src={navIcon1}
                    alt="Отправленные валентинки"
                  ></img>
                </Div>
                <span style={{ display: "flex", alignItems: "center" }}>
                  Отправленные валентинки
                </span>
              </Div>

              {/* Полученные валентинки */}
              <Div
                className="nav__button"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  paddingLeft: "32px",
                  justifyContent: "flex-start",
                }}
                size="l"
                onClick={() => go("myValentines", "received")}
              >
                <Div style={{ paddingLeft: "0px", marginLeft: "-1px" }}>
                  <img
                    style={{
                      maxHeight: "23px",
                      paddingTop: "2px",
                    }}
                    src={navIcon2}
                    alt="Полученные валентинки"
                  ></img>
                </Div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "3px",
                  }}
                >
                  Полученные валентинки
                </span>
              </Div>
            </Group>
          </Div>
        </>
      )}

      {/* Навигационная панель */}
      <Navigator go={go} />
    </Panel>
  );
};

MainScreen.propTypes = {
  id: PropTypes.string,
  valentinesSent: PropTypes.number,
  valentinesReceived: PropTypes.number,
  mutualMatches: PropTypes.number,
  go: PropTypes.func,
};

export default MainScreen;
