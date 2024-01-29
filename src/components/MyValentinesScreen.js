import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Panel, PanelHeader, Avatar, Button, Div } from "@vkontakte/vkui";
import Navigator from "./Navigator";
import "../styles/main.css";
import vkApi from "../utils/Api";
import "../styles/received.css";
import anonim from "../images/avatar.svg";

const MyValentinesScreen = ({ id, go }) => {
  const [receivedValentines, setReceivedValentines] = useState([]);
  const [valentines, setValentines] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [sendersData, setSendersData] = useState([]);
  const [selectedValentine, setSelectedValentine] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const getSentValentines = async () => {
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
      const userSenderVkId = userInfo.id.toString();

      try {
        const response = await fetch(
          "https://valentine.itc-hub.ru/api/v1/getvalentinereceived",
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

        const valentines = data.anonim || [];
        const notAnonimValentines = data["not anonim"] || [];

        // Обработка анонимных валентинок
        const formattedValentines = valentines.map((item) => ({
          id: item.id,
          senderId: null, 
          text: item.text,
          isAnonymous: true,
          backgroundId: item.background_id,
          imageId: item.valentine_id,
          createdTime: item.created,
          match: item.match,
        }));

        // Обработка не анонимных валентинок
        const notAnonimValentinesWithSenderInfo = notAnonimValentines.map(
          (item) => ({
            id: item.id,
            senderId: item.user_sender_vk_id,
            text: item.text,
            isAnonymous: false,
            backgroundId: item.background_id,
            imageId: item.valentine_id,
            createdTime: item.created,
            match: item.match,
          })
        );

        const idsArray = notAnonimValentinesWithSenderInfo.map(
          (v) => v.senderId
        );
        const ids = idsArray.join(",");

        const getUsersById = await vkApi.getSenderInfoById(ids);

        if (getUsersById && getUsersById.length > 0) {
          const sendersData = getUsersById.map((user) => ({
            userId: user.id,
            avatar: user.photo_200,
            firstName: user.first_name,
            lastName: user.last_name,
          }));

          setSendersData(sendersData);
        } else {
          console.error("Error getting user info or empty response");
        }
        setReceivedValentines([
          ...formattedValentines,
          ...notAnonimValentinesWithSenderInfo,
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    getSentValentines();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://valentine.itc-hub.ru/api/v1/getvalentines",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const valentinesWithFullPaths = data.valentines.map((valentine) => ({
          ...valentine,
          image: `https://valentine.itc-hub.ru${valentine.image}`,
        }));

        const backgroundsWithFullPaths = data.backgrounds.map((background) => ({
          ...background,
          image_background: `https://valentine.itc-hub.ru${background.image_background}`,
        }));
        setValentines(valentinesWithFullPaths);
        setBackgrounds(backgroundsWithFullPaths);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const openPopup = (valentineId) => {
    const valentines = receivedValentines.find((v) => v.id === valentineId);
    setSelectedValentine(valentines);

    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
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
    if (popupOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popupOpen]);

  const renderReceivedValentines = () => {
    return receivedValentines.map((valentine) => {
      const senderId = Number(valentine.senderId);
      const sender = sendersData.find((r) => r.userId === senderId);

      function formatRelativeDate(dateString) {
        const dateParts = dateString
          .split(".")
          .map((part) => parseInt(part, 10));
        const valentineDate = new Date(
          dateParts[2],
          dateParts[1] - 1,
          dateParts[0]
        );
        const currentDate = new Date();

        const timeDifference = currentDate.getTime() - valentineDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        if (daysDifference === 0) {
          return "сегодня";
        } else if (daysDifference === 1) {
          return "вчера";
        } else if (daysDifference > 1) {
          return `${daysDifference} дн${
            daysDifference > 1 && daysDifference < 4 ? "я " : "ей "
          }назад`;
        }

        return dateString;
      }

      const formattedDate = formatRelativeDate(valentine.createdTime);

      const avatarStyle = {
        ...(valentine.isAnonymous
          ? {
              backgroundImage: `url(${anonim})`,
              backgroundColor: "black",
              backgroundSize: "cover",
            }
          : valentine.match || !valentine.isAnonymous
          ? { backgroundImage: `url(${sender.avatar})` }
          : {}),
      };

      const getHeartClass = (valentine) => {
        let heartClass = "heart_basic";

        if (valentine.match) {
          heartClass = "heart_match";
        } else if (valentine.isAnonymous) {
          heartClass = "heart_anonim";
        }

        return heartClass;
      };

      return (
        <Div
          key={valentine.id}
          style={{
            marginBottom: 0,
            paddingLeft: "0",
            paddingRight: "0",
            paddingTop: "0",
          }}
        >
          <Div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              paddingTop: "0",
            }}
          >
            <Div
              style={{
                border: "1px solid #e2e0e0",
                borderRadius: "10px",
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Avatar style={avatarStyle} className="anon-avatar" />
              <Div
                style={{
                  paddingTop: "3px",
                  paddingLeft: "0",
                  paddingBottom: "0",
                }}
              >
                <h2
                  style={{
                    marginTop: "0",
                    fontSize: "16px",
                    marginBottom: "3px",
                  }}
                >
                  {valentine.isAnonymous
                    ? valentine.match
                      ? `${sender.firstName} ${sender.lastName}`
                      : "Аноним"
                    : `${sender.firstName} ${sender.lastName}`}
                </h2>
                <p
                  style={{
                    marginTop: "0",
                    fontWeight: "400",
                    fontSize: "14px",
                    marginBottom: "0",
                  }}
                >
                  {valentine.match
                    ? "У вас взаимная валентинка"
                    : "Отправил вам валентинку"}
                </p>
                <p
                  style={{
                    color: "grey",
                    fontWeight: "300",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {formattedDate}
                </p>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "#FF3347",
                  }}
                  size="s"
                  onClick={() => openPopup(valentine.id)}
                >
                  Посмотреть
                </Button>
              </Div>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  position: "absolute",
                  right: "40px",
                }}
                className={getHeartClass(valentine)}
              ></div>
            </Div>
          </Div>
        </Div>
      );
    });
  };

  return (
    <Panel id={"myValentines"}>
      <PanelHeader>Полученные</PanelHeader>
      <Div style={{ paddingTop: "15px" }}>
        {renderReceivedValentines()}
        {popupOpen && (
          <Div
            id="popup"
            onClose={closePopup}
            style={{
              position: "fixed",
              left: "50%",
              top: "46%",
              width: "80%",
              position: "fixed",
              backgroundColor: "white",
              transform: "translate(-50%, -50%)",
              padding: "0px 0px 0px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid rgb(193 193 193)",
            }}
          >
            <Div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "0",
                position: "absolute",
              }}
            >
              <img
                src={`${
                  backgrounds.find(
                    (b) => b.id === selectedValentine.backgroundId
                  )?.image_background
                }`}
                alt="Background"
                style={{
                  width: "100%",
                  height: "100%",
                  //top: "14%",
                  objectFit: "cover",
                  position: "absolute",
                  borderRadius: "10px",
                  opacity: "0.2",
                }}
              />
              <img
                src={`${
                  backgrounds.find(
                    (b) => b.id === selectedValentine.backgroundId
                  )?.image_background
                }`}
                alt="Background"
                style={{
                  width: "80%",
                  top: "14%",
                  objectFit: "cover",
                  position: "absolute",
                  borderRadius: "10px",
                  border: "1px solid rgb(193 193 193)",
                }}
              />
              <img
                src={`${
                  valentines.find((b) => b.id === selectedValentine.imageId)
                    ?.image
                }`}
                alt="Background"
                style={{
                  width: "80%",
                  top: "14%",
                  height: "auto",
                  objectFit: "cover",
                  position: "absolute",
                  borderRadius: "10px",
                }}
              />
            </Div>
            <p
              style={{
                marginTop: "70%",
                maxWidth: "300px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                color: "black",
                zIndex: 3,
              }}
            >
              {selectedValentine.text}
            </p>
            <Button
              style={{
                color: "white",
                backgroundColor: "#FF3347",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "10px",
              }}
              onClick={closePopup}
            >
              Закрыть
            </Button>
          </Div>
        )}
      </Div>
      <Div alignY="center" className="custom-popout-wrapper"></Div>
      <Navigator go={go} />
    </Panel>
  );
};

MyValentinesScreen.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
};
export default MyValentinesScreen;
