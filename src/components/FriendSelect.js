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
} from "@vkontakte/vkui";
import "../styles/main.css";
import Navigator from "./Navigator";
import vkApi from "../utils/Api";
//import "../styles/friends.css";

export default function SendValentineFriendSelect({
  onNext,
  onSelectFriend,
  go,
}) {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const handleSelectFriend = () => {
    onSelectFriend(selectedFriendId);
    console.log(selectedFriendId);
    onNext();
  };

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
      }
    }

    loadFriends();
  }, [[setSelectedFriendId]]);

  function toggleSelect(friendId) {
    if (selected.includes(friendId)) {
      setSelected([]);
      setSelectedFriendId(null);
    } else {
      const newSelected = [friendId];
      setSelected(newSelected);
      setSelectedFriendId(friendId);
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

  return (
    <Panel id="friend" className="container">
      <PanelHeader className="header">Выберите друга</PanelHeader>
      <div className="search-bar">
        <Input
          type="text"
          placeholder="Поиск друзей"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
            {selected.includes(friend.id) && (
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
      <Navigator go={go} />
    </Panel>
  );
}

SendValentineFriendSelect.propTypes = {
  onNext: PropTypes.func,
  go: PropTypes.func,
  onSelectFriend: PropTypes.func,
};
