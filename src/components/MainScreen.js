import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Avatar,
  Header,
  Switch,
  Separator,
} from "@vkontakte/vkui";
import "../styles/main.css";
import navIcon1 from "../images/nav1.svg";
import navIcon2 from "../images/nav2.svg";
import Navigator from "./Navigator";
import vkApi from "../utils/VkApi";
import useNotifications from "../hooks/useNotifications";
import { useNavigation } from "../your/navigation/context";
import { PATHS } from "./utils/const";
import { styled } from "styled-components";

const MainScreen = ({ baseUrl }) => {
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const { notificationsEnabled, handleNotificationsToggle } =
    useNotifications(baseUrl);
  const { navigate } = useNavigation();

  //получение данных пользователя монтировании компонента
  useEffect(() => {
    async function loadUser() {
      try {
        await vkApi.init();
        const userInfo = await vkApi.getUserInfo();
        setUser(userInfo);
        setUserLoading(false);
        setLoader(false);
      } catch (error) {
        console.error("Error loading userInfo:", error);
      }
    }
    loadUser();
  }, []);

  return (
    <MainPanel id="main">
      <PanelHeader>Валентинки</PanelHeader>
      {loader ? (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      ) : null}
      {!userLoading ? (
        <>
          <ProfileWrapper>
            <ProfileInfoWrapper>
              <ProfileAvatar src={user && user.photo_200} size={80} />
              <ProfileDiv>
                <Header level={5}>{`${user && user.first_name} ${
                  user && user.last_name
                }`}</Header>
              </ProfileDiv>
            </ProfileInfoWrapper>
          </ProfileWrapper>
          <Separator />
          <Group>
            <NotificationsWrapper>
              <NotificantionDiv>
                <NotificantionP>Уведомления</NotificantionP>
                <NotificantionSpan>Проверь свои валентинки</NotificantionSpan>
              </NotificantionDiv>
              <Switch
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
              />
            </NotificationsWrapper>
          </Group>
          <Separator />
          <Div style={{ padding: 0 }}>
            <NavigationGroup>
              <NavigationButton
                size="l"
                onClick={() => navigate(PATHS.SENT_VALENTINES)}
              >
                <NavigationDiv>
                  <NavigationImg src={navIcon1} alt="Отправленные валентинки" />
                </NavigationDiv>
                <NavigationSpan>Отправленные валентинки</NavigationSpan>
              </NavigationButton>
              <NavigationButton
                size="l"
                onClick={() => navigate(PATHS.MY_VALENTINES)}
              >
                <NavigationDiv2>
                  <NavigationImg2 src={navIcon2} alt="Полученные валентинки" />
                </NavigationDiv2>
                <NavigationSpan2>Полученные валентинки</NavigationSpan2>
              </NavigationButton>
            </NavigationGroup>
          </Div>
        </>
      ) : null}
      <Navigator />
    </MainPanel>
  );
};

// Styled components
const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const NotificantionSpan = styled.span`
  color: grey;
  padding-left: 0;
  font-size: 14px;
  margin-bottom: 10;
`;

const NavigationGroup = styled(Group)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 12;
`;

const NotificantionDiv = styled(Div)`
  display: flex;
  flex-direction: column;
`;

const NotificantionP = styled.p`
  padding-left: 0;
  margin-top: 10;
  margin-bottom: 10;
`;

const MainPanel = styled(Panel)`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Loader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ProfileWrapper = styled(Div)`
  padding: 0;
`;

const ProfileInfoWrapper = styled(Div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
`;

const ProfileAvatar = styled(Avatar)`
  border: 2px solid #ff3347;
`;

const ProfileDiv = styled(Div)`
  margin-left: 8;
  padding-left: 0;
`;

const NotificationsWrapper = styled(Div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 32px;
`;

const NavigationButton = styled(Div)`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-height: 40px;
`;

const NavigationDiv = styled(Div)`
  padding-left: 30px;
  padding-top: 6px;
`;

const NavigationImg = styled.img`
  max-height: 25px;
  padding-top: 2px;
`;

const NavigationSpan = styled.span`
  display: flex;
  align-items: center;
`;

const NavigationDiv2 = styled(Div)`
  padding-left: 32px;
  margin-left: -1px;
  padding-top: 6px;
`;

const NavigationImg2 = styled.img`
  max-height: 23px;
  padding-top: 2px;
`;

const NavigationSpan2 = styled.span`
  display: flex;
  align-items: center;
  padding-left: 2px;
`;

MainScreen.propTypes = {
  id: PropTypes.string,
  valentinesSent: PropTypes.number,
  valentinesReceived: PropTypes.number,
  mutualMatches: PropTypes.number,
};

export default MainScreen;
