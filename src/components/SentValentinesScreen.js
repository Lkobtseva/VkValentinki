import React, { useState, useEffect } from "react";
import { Panel, PanelHeader, Button, FixedLayout, Div } from "@vkontakte/vkui";
import vkApi from "../utils/VkApi";
import Navigator from "./Navigator";
import "../styles/nav.css";
import "../styles/main.css";
import arrow from "../images/arrow.png";
import useSentValentines from "../hooks/useGetSentValentines";
import useValentinesData from "../hooks/useValentinesData";

const SentValentinesScreen = ({ go, baseUrl }) => {
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
                {/* Показывать лоадер, если данные еще не загружены */}
                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : sentValentines.length > 0 ? (
                    renderSentValentines()
                ) : (
                    <p
                        style={{
                            textAlign: "center",
                            color: "#6d7885",
                        }}
                    >
                        Пока что вы не отправили ни одной валентинки
                    </p>
                )}
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
                                src={`${backgrounds.find(
                                    (b) => b.id === selectedValentine.backgroundId
                                )?.image_background
                                    }`}
                                alt="Background"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    position: "absolute",
                                    borderRadius: "10px",
                                    opacity: "0.2",
                                }}
                            />
                            <img
                                src={`${backgrounds.find(
                                    (b) => b.id === selectedValentine.backgroundId
                                )?.image_background
                                    }`}
                                alt="Background"
                                style={{
                                    width: "90%",
                                    top: "6%",
                                    objectFit: "cover",
                                    position: "absolute",
                                    borderRadius: "10px",
                                    border: "1px solid rgb(193 193 193)",
                                }}
                            />
                            <img
                                src={`${valentines.find((b) => b.id === selectedValentine.imageId)
                                    ?.image
                                    }`}
                                alt="Background"
                                style={{
                                    width: "90%",
                                    top: "6%",
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
            <Div className="custom-popout-wrapper"></Div>
            <Div
                style={{
                    bottom: "12%",
                    position: "fixed",
                    paddingLeft: "24px",
                }}
            >
                <Button
                    className="nav__button"
                    style={{
                        color: "white",
                        backgroundColor: "#FF3347",
                        marginTop: "15px",
                        border: "1px solid white",
                    }}
                    size="l"
                    stretched="true"
                    onClick={() => go("main")}
                >
                    <img
                        style={{
                            width: "25px",
                            height: "25px",
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginRight: "5px",
                        }}
                        src={arrow}
                    ></img>
                    <p style={{ marginRight: "10px" }}>Назад</p>
                </Button>
            </Div>
            <Navigator go={go} />
        </Panel>
    );
};

export default SentValentinesScreen;
