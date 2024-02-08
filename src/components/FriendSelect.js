import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Button,
  Div,
  Group,
  Input,
  Avatar,
  Snackbar,
} from "@vkontakte/vkui";
import "../styles/main.css";
import Navigator from "./Navigator";
import vkApi from "../utils/Api";

const SendValentineFriendSelect = ({ onNext, onSelectFriend, go }) => {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [sentValentines, setSentValentines] = useState([]);
  const [recipientsData, setRecipientsData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friendsDataLoaded, setFriendsDataLoaded] = useState(true);
  //выбор друга и переход к кастому валентинки
  const handleSelectFriend = () => {
    onSelectFriend(selectedFriendId);
    onNext();
  };

  // Функция для предоставления доступа к списку друзей
  const grantAccess = async () => {
    try {
      const permissionGranted = await vkApi.requestFriendsPermission();
      if (permissionGranted) {
        console.log("Access granted");
        setAccessGranted(true);
        await setFriendsToken(true);
      } else {
        console.log("Access denied");
        setAccessGranted(false);
      }
    } catch (error) {
      console.error("Error granting access to friends list:", error);
    }
  };

  // Функция рендера блока с друзьями
  useEffect(() => {
    async function loadFriends() {
      try {
        const friendsData = await vkApi.getFriends();
        if (friendsData) {
          const sortedFriends = friendsData.items.sort((a, b) => {
            const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
            const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
            return nameA.localeCompare(nameB);
          });

          setFriends(sortedFriends);
        }
      } catch (error) {
        console.error("Error loading friends:", error);
      } finally {
        setLoading(false); // Установка loading в false после загрузки друзей
      }
    }

    if (accessGranted) {
      loadFriends();
    }
  }, [accessGranted]);

  //установка статуса токена, разрешающего доступ к друзьям
  const setFriendsToken = async (status) => {
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
        "https://valentine.itc-hub.ru/api/v1/setfriendtoken",
        {
          method: "POST",
          headers: {
            Authorization: authString,
            Sign: signature,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vk_id: userSenderVkId,
            friend_token: status ? "1" : "0",
            //friend_token_text: "YOUR_TOKEN_VALUE_HERE", // Установка значения токена
          }),
        }
      );

      const data = await response.json();
      if (data.status === "save") {
        console.log("Friends tooken status saved successfully.");
        setAccessGranted(true);
      } else {
        console.error("Failed to save friends token status.");
        setAccessGranted(false);
      }
    } catch (error) {
      console.error("Error setting friends token:", error);
    }
  };

  //берем статус токена с бэка
  const getFriendsTokenStatus = async () => {
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
        "https://valentine.itc-hub.ru/api/v1/getfriendtoken",
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
      if (data.friend_token === false) {
        setAccessGranted(false);
      } else {
        setAccessGranted(true);
      }
    } catch (error) {
      console.error("Error getting friends token status:", error);
    }
  };

  // Функция для получения статуса токена при монтировании компонента
  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        // Получение ID отправителя
        const userInfo = await bridge.send("VKWebAppGetUserInfo");
        await getFriendsTokenStatus(userInfo.id);
        setFriendsDataLoaded(false);
      } catch (error) {
        console.error("Error checking token status:", error);
      }
    };
    checkTokenStatus();
  }, []);

  //(отправленная валентинка) для того чтобы проверить кому из друзей уже была отправлена валентинка
  useEffect(() => {
    const getSentValentines = async () => {
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
          "https://valentine.itc-hub.ru/api/v1/getvalentinesend",
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
        // Преобразуем ответ в нужный формат
        const valentine = data.map((item) => ({
          id: item.id,
          recipientId: item.user_recipient_vk_id,
          text: item.text,
          isAnonymous: item.anonim,
          backgroundId: item.background_id,
          imageId: item.valentine_id,
        }));

        const idsArray = valentine.map((v) => v.recipientId);
        const ids = idsArray.join(",");

        const getUsersById = await vkApi.getUserInfo(ids);

        if (getUsersById && getUsersById.length > 0) {
          const recipientsData = getUsersById.map((user) => ({
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
          }));

          setRecipientsData(recipientsData);
        } else {
          console.error("Error getting user info or empty response");
        }

        setSentValentines(valentine);
      } catch (error) {
        console.error(error);
      }
    };

    getSentValentines();
  }, []);

  //выбор друга
  function toggleSelect(friendId) {
    if (selected.includes(friendId)) {
      setSelected([]);
      setSelectedFriendId(null);
    } else {
      const newSelected = [friendId];
      setSelected(newSelected);
      setSelectedFriendId(friendId);

      // Проверка наличия выбранного друга в recipientsData
      const selectedFriend = recipientsData.find(
        (recipient) => recipient.userId === friendId
      );
      if (selectedFriend) {
        setPopupVisible(true);
      }
    }
  }

  // Фильтрация друзей по поисковому запросу
  const filteredFriends = friends.filter((friend) => {
    const fullName = `${friend.first_name} ${friend.last_name}`.toLowerCase();
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    return fullName.includes(trimmedSearchTerm);
  });
  // выбор друга сердечком
  const getHeartIconClass = (friendId) => {
    return selected.includes(friendId) ? "heart-icon_selected" : "";
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = document
        .getElementById("popup")
        .contains(event.target);
      if (!isClickInside) {
        closePopup();
      }
    };
    if (popupVisible) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popupVisible]);

  return (
    <Panel id="friend" className="container">
      <PanelHeader className="header">Выберите друга</PanelHeader>
      {/* Блок запроса доступа */}
      {!accessGranted && !friendsDataLoaded && (
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
              fontSize: "18px",
              marginBottom: "0",
              fontWeight: "bold",
              color: "#ff3347",
            }}
          >
            Раздел недоступен
          </p>
          <p
            style={{
              maxWidth: "325px",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            Для этого раздела нужен доступ к списку Ваших друзей
          </p>
          <Button
            className="access__button"
            style={{
              maxWidth: "200px",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "#ff3347",
            }}
            onClick={grantAccess}
          >
            Предоставить доступ
          </Button>
        </Div>
      )}

      {loading && accessGranted && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {accessGranted && !loading && (
        <div>
          <div className="search-bar">
            <Input
              type="text"
              placeholder="Поиск друзей"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {popupVisible && (
            <Snackbar id="popup" className="popupContainer">
              <p
                style={{
                  //maxWidth: "220px",
                  textAlign: "center",
                  //color: "white",
                  //marginTop: "5px",
                  fontSize: "16px",
                  //marginBottom: "10px",
                }}
              >
                Вы уже отправили валентинку этому другу.
              </p>
              <p
                style={{
                  // maxWidth: "220px",
                  textAlign: "center",
                  //color: "white",
                  //marginTop: "5px",
                  fontSize: "16px",
                }}
              >
                Отправить можно только один раз.
              </p>
            </Snackbar>
          )}
          <Group
            className="group-container"
            style={{
              maxHeight: "1500px",
              overflowY: "auto",
              padding: "15px",
              paddingTop: "0px",
              paddingBottom: "100px",
            }}
          >
            {filteredFriends.map((friend) => (
              <Div
                key={friend.id}
                className="friend-card"
                onClick={() => toggleSelect(friend.id)}
              >
                <Avatar
                  className="friend-avatar"
                  src={friend.photo_100}
                  alt={`${friend.first_name} ${friend.last_name}`}
                />
                <div className="friend-name">
                  {friend.first_name} {friend.last_name}
                </div>
                <div className={getHeartIconClass(friend.id)}></div>
                {selected.includes(friend.id) &&
                  !popupVisible &&
                  !recipientsData.find(
                    (recipient) => recipient.userId === friend.id
                  ) && (
                    <Button
                      className="select-button"
                      style={{
                        color: "white",
                        backgroundColor: "#FF3347",
                      }}
                      onClick={handleSelectFriend}
                    >
                      Выбрать
                    </Button>
                  )}
              </Div>
            ))}
          </Group>
        </div>
      )}
      <Navigator go={go} />
    </Panel>
  );
};

SendValentineFriendSelect.propTypes = {
  onNext: PropTypes.func,
  go: PropTypes.func,
  onSelectFriend: PropTypes.func,
};
export default SendValentineFriendSelect;
