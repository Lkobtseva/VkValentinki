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

const MainScreen = ({ go, baseUrl }) => {
    const [user, setUser] = useState({});
    const [userLoading, setUserLoading] = useState(true);
    const [loader, setLoader] = useState(true);
    const { notificationsEnabled, handleNotificationsToggle } = useNotifications(baseUrl);

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
        <Panel
            id="main"
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
            }}
        >
            <PanelHeader>Валентинки</PanelHeader>

            {/* Показывать лоадер, если данные еще не загружены */}
            {loader && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}
            {/* Блок профиля, уведомлений и навигационных кнопок */}
            {!userLoading && (
                <>
                    {/* Блок профиля */}
                    <Div style={{}}>
                        <Div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0",
                            }}
                        >
                            <Div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    style={{ border: "2px solid #FF3347" }}
                                    src={user && user.photo_200}
                                    size={80}
                                />
                                <Div style={{ marginLeft: 8, paddingLeft: 0 }}>
                                    <Header level={5}>{`${user && user.first_name} ${user && user.last_name
                                        }`}</Header>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                    <Separator />
                    {/* Блок уведомлений */}
                    <Group>
                        <Div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingTop: "0",
                                paddingBottom: "0px",
                                paddingRight: "32px",
                            }}
                        >
                            <Div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <p
                                    style={{
                                        paddingLeft: "0",
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Уведомления
                                </p>
                                <span
                                    style={{
                                        color: "grey",
                                        paddingLeft: "0",
                                        fontSize: "14px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Проверь свои валентинки
                                </span>
                            </Div>
                            <Switch
                                checked={notificationsEnabled}
                                onChange={handleNotificationsToggle}
                            />
                        </Div>
                    </Group>
                    <Separator />
                    {/* Навигационные кнопки */}
                    <Div style={{ padding: 0 }}>
                        <Group
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                paddingTop: "12px",
                            }}
                        >
                            {/* Отправленные валентинки */}
                            <Div
                                className="nav__button"
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    paddingLeft: "30px",
                                    justifyContent: "flex-start",
                                    maxHeight: "40px",
                                }}
                                size="l"
                                onClick={() => go("SentValentines", "sent")}
                            >
                                <Div
                                    style={{
                                        paddingLeft: "0px",
                                        paddingTop: "6px",
                                    }}
                                >
                                    <img
                                        style={{
                                            maxHeight: "25px",
                                            paddingTop: "2px",
                                        }}
                                        src={navIcon1}
                                        alt="Отправленные валентинки"
                                    ></img>
                                </Div>
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Отправленные валентинки
                                </span>
                            </Div>

                            {/* Полученные валентинки */}
                            <Div
                                className="nav__button"
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    paddingLeft: "32px",
                                    justifyContent: "flex-start",
                                    maxHeight: "40px",
                                }}
                                size="l"
                                onClick={() => go("myValentines", "received")}
                            >
                                <Div
                                    style={{
                                        paddingLeft: "0px",
                                        marginLeft: "-1px",
                                        paddingTop: "6px",
                                    }}
                                >
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
                                        paddingLeft: "2px",
                                    }}
                                >
                                    Полученные валентинки
                                </span>
                            </Div>
                        </Group>
                    </Div>
                </>
            )}
            {/* Навигационная панель */}
            <Navigator go={go} />
        </Panel>
    );
};

MainScreen.propTypes = {
    id: PropTypes.string,
    valentinesSent: PropTypes.number,
    valentinesReceived: PropTypes.number,
    mutualMatches: PropTypes.number,
    go: PropTypes.func,
};

export default MainScreen;
