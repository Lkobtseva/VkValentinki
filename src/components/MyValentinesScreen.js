import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Gallery,
  Avatar,
  Group,
  Button,
  Div,
} from "@vkontakte/vkui";
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
  const [avatars, setAvatars] = useState([]);

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
        // Преобразуем ответ в нужный формат
        const valentine = data.map((item) => ({
          id: item.id,
          senderId: item.user_sender_vk_id,
          text: item.text,
          isAnonymous: item.anonim,
          backgroundId: item.background_id,
          imageId: item.valentine_id,
          createdTime: item.created,
          match: item.match,
        }));

        const idsArray = valentine.map((v) => v.senderId);
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
          console.log("senders:", sendersData);
        } else {
          console.error("Error getting user info or empty response");
        }

        setReceivedValentines(valentine);
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
        console.log("фоны;", backgroundsWithFullPaths);
        setValentines(valentinesWithFullPaths);
        setBackgrounds(backgroundsWithFullPaths);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const openPopup = (valentineId) => {
    console.log("Opening popup for valentineId:", valentineId);

    const valentines = receivedValentines.find((v) => v.id === valentineId);
    console.log("Selected valentine:", valentines);

    setSelectedValentine(valentines);
    console.log("Selected Valentine:", selectedValentine);
    console.log("Popup should be opened now");
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

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
          return `${daysDifference} дня${
            daysDifference > 1 && daysDifference < 5 ? " " : "ев "
          }назад`;
        }

        return dateString;
      }

      const formattedDate = formatRelativeDate(valentine.createdTime);
      console.log(formattedDate);

      const avatarStyle = valentine.isAnonymous
        ? {
            backgroundImage: `url(${anonim})`,
            backgroundColor: "black",
            backgroundSize: "cover",
          }
        : { backgroundImage: `url(${sender.avatar})` };

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
                  {sender.firstName} {sender.lastName}
                </h2>
                <p
                  style={{
                    marginTop: "0",
                    fontWeight: "400",
                    fontSize: "14px",
                    marginBottom: "0",
                  }}
                >
                  Отправил вам валентинку
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
    <Panel id={id}>
      <PanelHeader>Полученные</PanelHeader>
      <Div style={{ paddingTop: "15px" }}>
        {renderReceivedValentines()}
        {popupOpen && (
          <Div
            onClose={closePopup}
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#bcbcbc6e",
              width: "100%",
              height: "100%",
              border: "1px solid #d6d5d5",
              borderRadius: "10px",
              paddingBottom: "100px",
            }}
          >
            <Div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Div
                style={{
                  display: "flex",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  flexDirection: "column",
                }}
              >
                <img
                  src={`${
                    backgrounds.find(
                      (b) => b.id === selectedValentine.backgroundId
                    )?.image_background
                  }`}
                  alt="Background"
                  style={{ width: "100%", borderRadius: "10px" }}
                />
                <img
                  src={`${
                    valentines.find((b) => b.id === selectedValentine.imageId)
                      ?.image
                  }`}
                  alt="Background"
                  style={{
                    width: "50%",
                    borderRadius: "10px",
                    marginTop: "-58%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
                <p style={{ marginTop: "12%" }}>{selectedValentine.text}</p>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "#FF3347",
                  }}
                  onClick={closePopup}
                >
                  Закрыть
                </Button>
              </Div>
            </Div>
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
