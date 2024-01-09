import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Panel, PanelHeader, FormLayout, Button, Div } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";

const SendValentineFriendSelect = ({ id, onNext }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppGetFriendsResult" && data && data.users) {
        // Обработка выбора друзей
        const friendInfoArray = data.users.map((friend) => {
          return {
            id: friend.id,
            first_name: friend.first_name,
            last_name: friend.last_name,
          };
        });

        setSelectedFriends(friendInfoArray);
      }
    });

    // Открываем окно выбора друзей
    bridge.send("VKWebAppGetFriends", {});
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader>Выберите друга</PanelHeader>

      <FormLayout>
        {selectedFriends.length > 0 && (
          <Div>
            {/* Дополнительная информация о выбранных друзьях */}
            {selectedFriends.map((friend) => (
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  border: "3px solid #e76e83",
                  borderRadius: "15px",
                  padding: "10px",
                  backgroundColor: "white",
                }}
                key={friend.id}
              >
                Выбран друг: {friend.first_name} {friend.last_name}
              </div>
            ))}
            <Button size="l" stretched onClick={onNext}>
              Готово
            </Button>
          </Div>
        )}
      </FormLayout>
    </Panel>
  );
};

SendValentineFriendSelect.propTypes = {
  id: PropTypes.string,
  onNext: PropTypes.func,
};

export default SendValentineFriendSelect;
