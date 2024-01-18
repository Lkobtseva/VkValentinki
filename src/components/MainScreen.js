import { React } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Avatar,
  Header,
  Button,
  Switch,
  Separator,
} from "@vkontakte/vkui";
import "../styles/main.css";
import navIcon1 from "../images/nav1.svg";
import navIcon2 from "../images/nav2.svg";
import Navigator from "./Navigator";

const MainScreen = ({ user, go }) => {
  return (
    <Panel id={"main"}>
      <PanelHeader>Название</PanelHeader>

      {/* Блок профиля */}
      <Group>
        <Div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "0",
          }}
        >
          <Div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              style={{ border: "5px solid #FF3347" }}
              src={user && user.photo_200}
              size={80}
            />
            <Div style={{ marginLeft: 8, paddingLeft: 0 }}>
              <Header level={5}>{`${user && user.first_name} ${
                user && user.last_name
              }`}</Header>
            </Div>
          </Div>
        </Div>
        <Separator style={{ display: "none" }}></Separator>
      </Group>

      {/* Блок уведомлений */}
      <Group>
        <Div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Div style={{ display: "flex", flexDirection: "column" }}>
            <Header style={{ paddingLeft: "0" }}>Уведомления</Header>
            <span style={{ color: "grey", paddingLeft: "0", fontSize: "14px" }}>
              О приходе новой валентинки
            </span>
          </Div>
          <Switch defaultChecked={true} />
        </Div>
      </Group>

      {/* Навигационные кнопки */}
      <Div style={{ paddingLeft: "0px" }}>
        <Div
          style={{
            display: "flex",
            flexDirection: "column",
            //gap: "10px",
            justifyContent: "space-between",
          }}
        >
          {/* Отправленные валентинки */}
          <Div
            className="nav__button"
            style={{
              cursor: "pointer",
              display: "flex",
              paddingLeft: "14px",
              color: "black",
              justifyContent: "flex-start",
            }}
            size="l"
            stretched
            onClick={() => go("SentValentines", "sent")}
          >
            <Div style={{ paddingLeft: "0px" }}>
              <img
                style={{
                  maxHeight: "25px",

                  paddingTop: "2px",
                }}
                src={navIcon1}
                alt="Отправленные валентинки"
              ></img>
            </Div>
            <span style={{ display: "flex", alignItems: "center" }}>
              Отправленные валентинки
            </span>
          </Div>

          {/* Полученные валентинки */}
          <Div
            className="nav__button"
            style={{
              cursor: "pointer",
              display: "flex",
              color: "black",
              justifyContent: "flex-start",
            }}
            size="l"
            stretched
            onClick={() => go("myValentines", "received")}
          >
            <Div style={{ paddingLeft: "0px", marginLeft: "-1px" }}>
              <img
                style={{
                  maxHeight: "23px",
                  paddingTop: "2px",
                }}
                src={navIcon2}
                alt="Полученные валентинки"
              ></img>
            </Div>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "3px",
              }}
            >
              Полученные валентинки
            </span>
          </Div>
        </Div>
      </Div>

      {/* Навигационная панель */}
      <Navigator go={go} />
    </Panel>
  );
};

MainScreen.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
  valentinesSent: PropTypes.number,
  valentinesReceived: PropTypes.number,
  mutualMatches: PropTypes.number,
  go: PropTypes.func,
};

export default MainScreen;
