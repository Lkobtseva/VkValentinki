import React, { useState, useEffect } from "react";
import { Panel, PanelHeader, Button, FixedLayout, Div } from "@vkontakte/vkui";
import vkApi from "../utils/Api";
import Navigator from "./Navigator";
import "../styles/nav.css";
import "../styles/main.css";

const SentValentinesScreen = ({ id, go }) => {
  const [sentValentines, setSentValentines] = useState([]);
  const [recipientsData, setRecipientsData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedValentine, setSelectedValentine] = useState(null);
  const [backgrounds, setBackgrounds] = useState([]);
  const [valentines, setValentines] = useState([]);

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

        const getUsersById = await vkApi.getUserInfoById(ids);

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
    const valentines = sentValentines.find((v) => v.id === valentineId);

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

  const renderSentValentines = () => {
    return sentValentines.map((valentine) => {
      const recipientId = Number(valentine.recipientId);
      const recipient = recipientsData.find((r) => r.userId === recipientId);

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
                flexDirection: "column",
              }}
            >
              <h2 style={{ marginTop: "0", fontSize: "18px" }}>
                Вы отправили валентинку:
              </h2>
              <p style={{ marginTop: "0", fontWeight: "300" }}>
                {recipient.firstName} {recipient.lastName}
              </p>
              <Button
                style={{
                  color: "white",
                  backgroundColor: "#FF3347",
                }}
                size="m"
                onClick={() => openPopup(valentine.id)}
              >
                Посмотреть
              </Button>
            </Div>
          </Div>
        </Div>
      );
    });
  };

  return (
    <Panel id={"SentValentines"}>
      <FixedLayout filled vertical="top">
        <PanelHeader>Отправленные</PanelHeader>
      </FixedLayout>
      <Div style={{ paddingTop: "70px", paddingBottom: "100px" }}>
        {renderSentValentines()}
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
              padding: "0px 0px 00px",
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
                  width: "50%",
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
                marginTop: "65%",
                maxWidth: "300px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                color: "black",
                zIndex: "3",
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

export default SentValentinesScreen;
