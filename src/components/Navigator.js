import { React, useState, useEffect } from "react";

import PropTypes from "prop-types";
import { Div, FixedLayout, Tabbar, TabbarItem } from "@vkontakte/vkui";
import "../styles/nav.css";

const Navigator = ({ go }) => {
  const [isMainPage, setIsMainPage] = useState(false);
  const [isSend, setIsSend] = useState(false);

  useEffect(() => {
    const mainPageElement = document.getElementById("main");
    const myValentinesScreen = document.getElementById("myValentines");
    const sentValentinesScreen = document.getElementById("SentValentines");
    setIsMainPage(
      mainPageElement || myValentinesScreen || sentValentinesScreen
    );

    const designElement = document.getElementById("design");
    const friendElement = document.getElementById("friend");
    const sendingMessageElement = document.getElementById("sendingMessage");

    setIsSend(designElement || friendElement || sendingMessageElement);
  }, []);

  return (
    <FixedLayout
      filled
      vertical="bottom"
      id={"navigator"}
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        borderTopColor: "#3d3d3d",
        borderTopWidth: "0.5px",
        borderTopStyle: "solid",
      }}
    >
      <Tabbar
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingTop: "0px",
        }}
      >
        {/* Кнопка "Отправить" */}
        <TabbarItem
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            paddingTop: "7px",
          }}
          size="l"
          stretched
          onClick={() => go("friend")}
        >
          <Div
            className={
              isSend
                ? "navBar__button1_active"
                : isMainPage
                ? "navBar__button1"
                : ""
            }
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
          ></Div>
          <span
            className={
              isSend ? "send__span_active" : isMainPage ? "send__span" : ""
            }
            style={{ fontSize: "12px", paddingTop: "5px" }}
          >
            Отправить
          </span>
        </TabbarItem>

        {/* Кнопка "Профиль" */}
        <TabbarItem
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            paddingTop: "7px",
          }}
          size="l"
          stretched
          onClick={() => go("main")}
        >
          <Div
            className={
              isMainPage
                ? "navBar__button2_active"
                : isSend
                ? "navBar__button2"
                : ""
            }
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
          ></Div>
          <span
            className={
              isMainPage
                ? "profile__span_active"
                : isSend
                ? "profile__span"
                : ""
            }
            style={{ fontSize: "12px", paddingTop: "5px" }}
          >
            Профиль
          </span>
        </TabbarItem>
      </Tabbar>
    </FixedLayout>
  );
};

Navigator.propTypes = {
  go: PropTypes.func,
};

export default Navigator;
