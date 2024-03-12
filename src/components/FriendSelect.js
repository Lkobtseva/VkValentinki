import React, { useState, useEffect } from "react";
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
import vkApi from "../utils/VkApi";
import useFriendsToken from "../hooks/useFriendToken";
import useSentValentines from "../hooks/useGetSentValentines";

const SendValentineFriendSelect = ({ onNext, onSelectFriend, go, baseUrl }) => {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [recipientsData, setRecipientsData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { sentValentines } = useSentValentines(vkApi, baseUrl);
  const { accessGranted, grantAccess } = useFriendsToken(baseUrl);

  //выбор друга и переход к кастому валентинки
  const handleSelectFriend = () => {
    onSelectFriend(selectedFriendId);
    onNext();
  };

  //рендер блока с друзьями
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
        setError(true);
        console.error("Error loading friends:", error);
      } finally {
        setLoading(false);
      }
    }

    if (accessGranted) {
      loadFriends();
    }
  }, [accessGranted]);

  //проверка кому уже отправляли валентинку
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = sentValentines;

        const valentine = Array.isArray(data) ?
          data.map((item) => ({
            id: item.id,
            recipientId: item.user_recipient_vk_id,
            text: item.text,
            isAnonymous: item.anonim,
            backgroundId: item.background_id,
            imageId: item.valentine_id,
          })) :
          [];

        const idsArray = valentine.map((v) => v.recipientId);
        const ids = idsArray.join(",");

        const getUsersById = await vkApi.getRecipientInfoById(ids);

        if (getUsersById && getUsersById.length > 0) {
          const recipientsData = getUsersById.map((user) => ({
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
          }));

          setRecipientsData(recipientsData);
        } else {
          console.error("Error getting user info or empty response_1");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [sentValentines]);

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

  //закрытие попапа
  const closePopup = () => {
    setPopupVisible(false);
  };

  //закрытие попапа по клику вне попапа
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

  if (error) {
    return (
      <Div
        style={{
          marginTop: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          style={{
            color: "#ff3347",
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          Ничего не найдено, попробуйте зайти в приложение еще раз
        </p>
      </Div>
    );
  }

  return (
    <Panel id="friend" className="container">
      <PanelHeader className="header">Выберите друга</PanelHeader>
      {/* Блок запроса доступа */}
      {!accessGranted && !loading && (
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
            onClick={() => grantAccess()}
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
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                Вы уже отправили валентинку этому другу.
              </p>
              <p
                style={{
                  textAlign: "center",
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
