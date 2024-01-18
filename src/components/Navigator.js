import { React, useState, useEffect } from "react";

import PropTypes from "prop-types";
import {
  Group,
  Div,
} from "@vkontakte/vkui";
import "../styles/nav.css";

const Navigator = ({ go }) => {
  const [isMainPage, setIsMainPage] = useState(false);
  const [isSend, setIsSend] = useState(false);

  useEffect(() => {
    const mainPageElement = document.getElementById("main");
    setIsMainPage(mainPageElement);

    const designElement = document.getElementById("design");
    const friendElement = document.getElementById("friend");
    const sendingMessageElement = document.getElementById("sendingMessage");

    setIsSend(!!(designElement || friendElement || sendingMessageElement));
  }, []);
  return (
    <Group
      id={"navigator"}
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        borderRadius: "10px",
        borderTop: "1px solid #cbcccd",
        backgroundColor: "white",
      }}
    >
      <Div style={{ display: "flex", justifyContent: "space-around" }}>
        {/* Кнопка "Отправить" */}
        <Div
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
          size="l"
          stretched
          onClick={() => go("friend")}
        >
          <Div
            className={
              isSend
                ? "navBar__button1_active"
                : "" || isMainPage
                ? "navBar__button1"
                : ""
            }
            style={{
              backgroundColor: "transparent",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          ></Div>
          <span
            className={
              isSend
                ? "send__span_active"
                : "" || isMainPage
                ? "send__span"
                : ""
            }
            style={{ fontSize: "12px", paddingTop: "5px" }}
          >
            Отправить
          </span>
        </Div>

        {/* Кнопка "Профиль" */}
        <Div
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
          size="l"
          stretched
          onClick={() => go("main")}
        >
          <Div
            className={
              isMainPage
                ? "navBar__button2_active"
                : "" || isSend
                ? "navBar__button2"
                : ""
            }
            style={{
              backgroundColor: "transparent",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          ></Div>
          <span
            className={
              isMainPage
                ? "profile__span_active"
                : "" || isSend
                ? "profile__span"
                : ""
            }
            style={{ fontSize: "12px", paddingTop: "5px" }}
          >
            Профиль
          </span>
        </Div>
      </Div>
    </Group>
  );
};
Navigator.propTypes = {
  id: PropTypes.string,
  go: PropTypes.func,
};

export default Navigator;
