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
import { useNavigation } from "../your/navigation/context";
import { PATHS } from "./utils/const";
import { styled } from "styled-components";

const SendValentineFriendSelect = ({ onSelectFriend, baseUrl }) => {
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
  const { navigate } = useNavigation();

  //выбор друга и переход к кастому валентинки
  const handleSelectFriend = () => {
    onSelectFriend(selectedFriendId);
    navigate(PATHS.DESIGN_SELECT);
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

        const valentine = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              recipientId: item.user_recipient_vk_id,
              text: item.text,
              isAnonymous: item.anonim,
              backgroundId: item.background_id,
              imageId: item.valentine_id,
            }))
          : [];

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
      <ErrorDiv>
        <ErrorText>
          Ничего не найдено, попробуйте зайти в приложение еще раз
        </ErrorText>
      </ErrorDiv>
    );
  }

  return (
    <Panel id="friend" className="container">
      <PanelHeader className="header">Выберите друга</PanelHeader>
      {/* Блок запроса доступа */}
      {!accessGranted && !loading && (
        <AccessDiv>
          <AccessP>Раздел недоступен</AccessP>
          <AccessP2>
            Для этого раздела нужен доступ к списку Ваших друзей
          </AccessP2>
          <AccessButton
            className="access__button"
            onClick={() => grantAccess()}
          >
            Предоставить доступ
          </AccessButton>
        </AccessDiv>
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
          {popupVisible ? (
            <Snackbar id="popup" className="popupContainer">
              <p className="error__p">
                Вы уже отправили валентинку этому другу.
              </p>
              <p  className="error__p">
                Отправить можно только один раз.
              </p>
            </Snackbar>
          ) : null}
          <GroupContainer className="group-container">
            {filteredFriends?.map((friend) => (
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
                    <SelectButton
                      className="select-button"
                      onClick={handleSelectFriend}
                    >
                      Выбрать
                    </SelectButton>
                  )}
              </Div>
            ))}
          </GroupContainer>
        </div>
      )}
      <Navigator />
    </Panel>
  );
};

// Styled components
const AccessDiv = styled(Div)`
  && {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
  }
`;

const SelectButton = styled(Button)`
  && {
    color: white;
    background-color: #FF3347;
  }
`;

const AccessP = styled.p`
  max-width: 325px;
  margin-left: auto;
  margin-right: auto;
  font-size: 18px;
  margin-bottom: 0;
  font-weight: bold;
  color: #ff3347;
`;

const AccessP2 = styled.p`
  max-width: 325px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-top: 10px;
`;

const AccessButton = styled(Button)`
  && {
    max-width: 200px;
    margin-left: auto;
    margin-right: auto;
    background-color: #ff3347;
  }
`;

const GroupContainer = styled(Group)`
  && {
    max-height: 1500px;
    overflow-y: auto;
    padding: 15px;
    padding-top: 0px;
    padding-bottom: 100px;
  }
`;

const ErrorDiv = styled(Div)`
  && {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const ErrorText = styled.p`
  color: #ff3347;
  font-size: 18px;
  margin-bottom: 10px;
`;

SendValentineFriendSelect.propTypes = {
  onSelectFriend: PropTypes.func,
};
export default SendValentineFriendSelect;
