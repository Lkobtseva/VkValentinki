import React, { useState, useEffect } from "react";
import { Panel, PanelHeader, Button, FixedLayout, Div } from "@vkontakte/vkui";
import vkApi from "../utils/VkApi";
import Navigator from "./Navigator";
import "../styles/nav.css";
import "../styles/main.css";
import arrow from "../images/arrow.png";
import useSentValentines from "../hooks/useGetSentValentines";
import useValentinesData from "../hooks/useValentinesData";
import { useNavigation } from "../your/navigation/context";
import { PATHS } from "./utils/const";
import styled from "styled-components";

const SentValentinesScreen = ({ baseUrl }) => {
  const [sentValentines, setSentValentines] = useState([]);
  const [recipientsData, setRecipientsData] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedValentine, setSelectedValentine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sentValentines: fetchedValentines } = useSentValentines(
    vkApi,
    baseUrl
  );
  const { valentines, backgrounds } = useValentinesData(baseUrl);
  const { navigate } = useNavigation();

  //получение отправленных валентинок
  useEffect(() => {
    if (!fetchedValentines) {
      return;
    }
    const fetchData = async () => {
      try {
        const valentine = Array.isArray(fetchedValentines)
          ? fetchedValentines.map((item) => ({
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

        const getUsersById = await vkApi.getRecipients(ids);

        if (
          getUsersById &&
          getUsersById.items &&
          getUsersById.items.length > 0
        ) {
          const usersArray = getUsersById.items;
          const recipientsData = usersArray.map((user) => ({
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
          }));

          setRecipientsData(recipientsData);
        } else {
          console.error("Error getting user info or empty response_3");
        }
        setSentValentines(valentine);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [fetchedValentines]);

  //попап
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
        <StyledDiv key={valentine.id}>
          <ContainerDiv>
            <ValentineDiv>
              <StyledH2>Вы отправили валентинку:</StyledH2>
              <StyledP>
                {recipient.firstName} {recipient.lastName}
              </StyledP>
              <StyledButton size="m" onClick={() => openPopup(valentine.id)}>
                Посмотреть
              </StyledButton>
            </ValentineDiv>
          </ContainerDiv>
        </StyledDiv>
      );
    });
  };

  return (
    <Panel id={"SentValentines"}>
      <FixedLayout filled vertical="top">
        <PanelHeader>Отправленные</PanelHeader>
      </FixedLayout>

      <Div style={{ paddingTop: "70px", paddingBottom: "100px" }}>
        {/* Показывать лоадер, если данные еще не загружены */}
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : sentValentines.length > 0 ? (
          renderSentValentines()
        ) : (
          <NoValentinesP>
            Пока что вы не отправили ни одной валентинки
          </NoValentinesP>
        )}
        {popupOpen && (
          <StyledPopupDiv id="popup" onClose={closePopup}>
            <InnerPopupDiv>
              <StyledPopupImg
                src={`${
                  backgrounds.find(
                    (b) => b.id === selectedValentine.backgroundId
                  )?.image_background
                }`}
                alt="Background"
              />
              <Background
                src={`${
                  backgrounds.find(
                    (b) => b.id === selectedValentine.backgroundId
                  )?.image_background
                }`}
                alt="Background"
              />
              <StyledImage
                src={`${
                  valentines.find((b) => b.id === selectedValentine.imageId)
                    ?.image
                }`}
                alt="Background"
              />
            </InnerPopupDiv>
            <StyledPopupText>{selectedValentine.text}</StyledPopupText>
            <CloseButton onClick={closePopup}>Закрыть</CloseButton>
          </StyledPopupDiv>
        )}
      </Div>
      <Div className="custom-popout-wrapper"></Div>
      <BackDiv>
        <BackButton
          className="nav__button"
          size="l"
          stretched="true"
          onClick={() => navigate(PATHS.MAIN)}
        >
          <ArrowImage src={arrow}></ArrowImage>
          <p style={{ marginRight: "10px" }}>Назад</p>
        </BackButton>
      </BackDiv>
      <Navigator />
    </Panel>
  );
};

// Styled components
const StyledDiv = styled(Div)`
  && {
    margin-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
`;

const BackDiv = styled(Div)`
  bottom: 12%;
  position: fixed;
  padding-left: 24px;
`;

const Background = styled.img`
  width: 90%;
  top: 6%;
  object-fit: cover;
  position: absolute;
  border-radius: 10px;
  border: 1px solid rgb(193 193 193);
`;

const StyledImage = styled.img`
  width: 90%;
  top: 6%;
  object-fit: cover;
  position: absolute;
  border-radius: 10px;
  height: auto;
`;

const BackButton = styled(Button)`
  color: white;
  background-color: #ff3347;
  margin-top: 15px;
  border: 1px solid white;
`;

const CloseButton = styled(Button)`
  color: white;
  background-color: #ff3347;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
`;

const ArrowImage = styled.img`
  width: 25px;
  height: 25px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 5px;
`;

const ValentineDiv = styled(Div)`
  && {
    border: 1px solid #e2e0e0;
    border-radius: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const ContainerDiv = styled(Div)`
  && {
    display: flex;
    align-items: center;
    padding: 8px;
    padding-top: 0;
  }
`;

const NoValentinesP = styled.p`
  text-align: center;
  color: #6d7885;
`;

const StyledH2 = styled.h2`
  margin-top: 0;
  font-size: 18px;
`;

const StyledP = styled.p`
  margin-top: 0;
  font-weight: 300;
`;

const StyledPopupDiv = styled(Div)`
  && {
    position: fixed;
    left: 50%;
    top: 46%;
    width: 80%;
    position: fixed;
    background-color: white;
    transform: translate(-50%, -50%);
    padding: 0px 0px 00px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgb(193 193 193);
  }
`;

const StyledPopupImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  border-radius: 10px;
  opacity: 0.2;
`;

const StyledPopupText = styled.p`
  margin-top: 70%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: black;
  z-index: 3;
`;

const StyledButton = styled(Button)`
  && {
    color: white;
    background-color: #ff3347;
  }
`;

const InnerPopupDiv = styled(Div)`
  && {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 0
    position: absolute;
  }
`;

export default SentValentinesScreen;
