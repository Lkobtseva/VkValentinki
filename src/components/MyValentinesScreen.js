import React, { useState, useEffect } from "react";
import {
  Panel,
  PanelHeader,
  Avatar,
  Button,
  Div,
  FixedLayout,
} from "@vkontakte/vkui";
import Navigator from "./Navigator";
import "../styles/main.css";
import vkApi from "../utils/VkApi";
import "../styles/received.css";
import anonim from "../images/avatar.svg";
import arrow from "../images/arrow.png";
import useValentinesData from "../hooks/useValentinesData";
import useAuthString from "../hooks/useGetAuthString";
import { useNavigation } from "../your/navigation/context";
import { PATHS } from "./utils/const";
import { styled } from "styled-components";

const MyValentinesScreen = ({ baseUrl }) => {
  const [receivedValentines, setReceivedValentines] = useState([]);
  const [sendersData, setSendersData] = useState([]);
  const [selectedValentine, setSelectedValentine] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { valentines, backgrounds } = useValentinesData(baseUrl);
  const { signature, authString } = useAuthString();
  const { navigate } = useNavigation();

  //получение отправленных валентинок
  useEffect(() => {
    const getValentinesReceived = async () => {
      if (!authString || !signature) {
        return;
      }
      const userInfo = await vkApi.getUserInfo();
      const userSenderVkId = userInfo.id.toString();
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/getvalentinereceived`, {
          method: "POST",
          headers: {
            Authorization: authString,
            Sign: signature,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vk_id: userSenderVkId,
          }),
        });

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

        const getUsersById = await vkApi.getFriends(ids);
        if (
          getUsersById &&
          getUsersById.items &&
          getUsersById.items.length > 0
        ) {
          const usersArray = getUsersById.items;

          const sendersData = usersArray.map((user) => ({
            userId: user.id,
            avatar: user.photo_100,
            firstName: user.first_name,
            lastName: user.last_name,
          }));
          setSendersData(sendersData);
        } else {
          console.error("Error getting user info or empty response_2");
        }
        setLoading(false);
        setReceivedValentines([
          ...formattedValentines,
          ...notAnonimValentinesWithSenderInfo,
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    getValentinesReceived();
  }, [authString, signature]);

  //попап
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

  //рендер
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
        <WrapperDiv key={valentine.id}>
          <ContainerDiv>
            <StyledDiv>
              <Avatar style={avatarStyle} className="anon-avatar" />
              <ContentDiv>
                <TitleHeading>
                  {valentine.isAnonymous
                    ? valentine.match
                      ? `${sender.firstName} ${sender.lastName}`
                      : "Аноним"
                    : `${sender.firstName} ${sender.lastName}`}
                </TitleHeading>
                <DescriptionParagraph>
                  {valentine.match
                    ? "У вас взаимная валентинка"
                    : "Отправил вам валентинку"}
                </DescriptionParagraph>
                <DateParagraph>{formattedDate}</DateParagraph>
                <StyledButton size="s" onClick={() => openPopup(valentine.id)}>
                  Посмотреть
                </StyledButton>
              </ContentDiv>
              <HeartDiv className={getHeartClass(valentine)}></HeartDiv>
            </StyledDiv>
          </ContainerDiv>
        </WrapperDiv>
      );
    });
  };

  return (
    <Panel id={"myValentines"}>
      <FixedLayout filled vertical="top" style={{ marginBottom: "25px" }}>
        <PanelHeader>Полученные</PanelHeader>
      </FixedLayout>

      <LoaderDiv>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {receivedValentines.length > 0 ? (
              renderReceivedValentines()
            ) : (
              <NoValentinesP>
                Пока что у вас нет полученных валентинок
              </NoValentinesP>
            )}
          </>
        )}

        {popupOpen && (
          <PopupDiv id="popup" onClose={closePopup}>
            <ImageDiv>
              <ImageBackground
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
                alt="icon"
              />
            </ImageDiv>
            <ValentineText>{selectedValentine.text}</ValentineText>
            <CloseButton onClick={closePopup}>Закрыть</CloseButton>
          </PopupDiv>
        )}
      </LoaderDiv>
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
const WrapperDiv = styled.div`
  margin-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
`;

const HeartDiv = styled.div`
  width: 28px;
  height: 28px;
  position: absolute;
  right: 40px;
`;

const ContainerDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  padding-top: 0;
`;

const ContentDiv = styled.div`
  padding-top: 3px;
  padding-left: 0;
  padding-bottom: 0;
`;

const ImageBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  border-radius: 10px;
  opacity: 0.2;
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

const ArrowImage = styled.img`
  width: 25px;
  height: 25px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 5px;
`;

const TitleHeading = styled.h2`
  margin-top: 0;
  font-size: 16px;
  margin-bottom: 3px;
`;

const DescriptionParagraph = styled.p`
  margin-top: 0;
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 0;
`;

const DateParagraph = styled.p`
  color: grey;
  font-weight: 300;
  font-size: 14px;
  margin-top: 5px;
`;

const NoValentinesP = styled.p`
  text-align: center;
  color: #6d7885;
`;

const ValentineText = styled.p`
  margin-top: 70%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: black;
  z-index: 3;
`;

const StyledDiv = styled(Div)`
  border: 1px solid #e2e0e0;
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const LoaderDiv = styled(Div)`
  padding-top: 70px;
  padding-bottom: 100px;
`;

const BackDiv = styled(Div)`
  bottom: 12%;
  position: fixed;
  padding-left: 24px;
`;

const ImageDiv = styled(Div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  position: absolute;
`;

const PopupDiv = styled(Div)`
  position: fixed;
  left: 50%;
  top: 46%;
  width: 80%;
  position: fixed;
  background-color: white;
  transform: translate(-50%, -50%);
  padding: 0px 0px 0px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgb(193 193 193);
`;

const StyledButton = styled(Button)`
  color: white;
  background-color: #ff3347;
`;

const CloseButton = styled(Button)`
  color: white;
  background-color: #ff3347;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
`;

const BackButton = styled(Button)`
  color: white;
  background-color: #ff3347;
  margin-top: 15px;
  border: 1px solid white;
`;

export default MyValentinesScreen;
