import { React, useState, useEffect } from "react";
import { useNavigation } from "../your/navigation/context";
import { useLocation } from "react-router-dom";
import { PATHS } from "./utils/const";
import { Div, FixedLayout, Tabbar, TabbarItem } from "@vkontakte/vkui";
import "../styles/nav.css";
import styled from 'styled-components';

const Navigator = () => {
  const [isMainPage, setIsMainPage] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const { navigate } = useNavigation();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;

    setIsMainPage(
      pathname === PATHS.MAIN ||
        pathname === PATHS.MY_VALENTINES ||
        pathname === PATHS.SENT_VALENTINES
    );

    setIsSend(
      pathname === PATHS.DESIGN_SELECT ||
        pathname === PATHS.FRIEND_SELECT ||
        pathname === PATHS.SEND_VALENTINE_MESSAGE
    );
  }, [location]);

  return (
    <FixedLayout
      filled
      vertical="bottom"
      id={"navigator"}
      className="navigator"
    >
      <Tabbar className="navigator__tabbar">
        {/* Кнопка "Отправить" */}
        <TabbarItem
          className="navigator__tabbar_item"
          size="l"
          stretched="true"
          onClick={() => navigate(PATHS.FRIEND_SELECT)}
        >
          <ButtonDiv
            className={
              isSend
                ? "navBar__button1_active"
                : isMainPage
                ? "navBar__button1"
                : ""
            }
          ></ButtonDiv>
          <ButtonSpan
            className={
              isSend ? "send__span_active" : isMainPage ? "send__span" : ""
            }
          >
            Отправить
          </ButtonSpan>
        </TabbarItem>

        {/* Кнопка "Профиль" */}
        <TabbarItem
          className="navigator__tabbar_item"
          size="l"
          stretched="true"
          onClick={() => navigate(PATHS.MAIN)}
        >
          <ButtonDiv
            className={
              isMainPage
                ? "navBar__button2_active"
                : isSend
                ? "navBar__button2"
                : ""
            }
          ></ButtonDiv>
          <ButtonSpan
            className={
              isMainPage
                ? "profile__span_active"
                : isSend
                ? "profile__span"
                : ""
            }
          >
            Профиль
          </ButtonSpan>
        </TabbarItem>
      </Tabbar>
    </FixedLayout>
  );
};

// Styled components
const ButtonDiv = styled(Button)`
  && {
    color: white;
    background-color: #ff3347;
  }
`;

const ButtonSpan = styled.span`
  font-size: 12px;
  padding-top: 5px;
`;
export default Navigator;
