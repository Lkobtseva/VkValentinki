import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  View,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./index.css";
import MainScreen from "./components/MainScreen";
import SendValentineDesignSelect from "./components/DesignSelect.js";
import SendValentineMessage from "./components/ValentineMessage";
import MyValentinesScreen from "./components/MyValentinesScreen";
import SendValentineFriendSelect from "./components/FriendSelect";
import SentValentineScreen from "./components/SentValentinesScreen";
import useCreateUser from "./hooks/useCreateUser";
import useSendValentine from "./hooks/useSendValentine";
import { PATHS } from "./utils/const";
const baseUrl = "https://valentine.itc-hub.ru/api/v1";

const App = () => {
  const [friendId, setFriendId] = useState(null);
  const [valentineId, setValentineId] = useState(null);
  const [backgroundId, setBackgroundId] = useState(null);
  const [message, setMessage] = useState("");
  const [isAnonymous, setAnonymous] = useState(false);

  //инициализация приложения
  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      try {
        if (isMounted) {
          console.log("success");
        }
      } catch (error) {
        console.error(error);
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  //установка дефолтного маршрута
  useEffect(() => {
    navigate(PATHS.MAIN);
  }, []);

  //выбор дизайна валентинки
  const handleSelectDesign = (selectedValentineId, selectedBackgroundId) => {
    setValentineId(selectedValentineId);
    setBackgroundId(selectedBackgroundId);
  };

  //выбор друга
  const handleSelectFriend = (selectedFriendId) => {
    setFriendId(selectedFriendId);
  };

  //установка сообщения к валентинке
  const handleSelectMessage = (text, isAnon) => {
    setMessage(text);
    setAnonymous(isAnon);
  };

  //отправка валентинки на бэк
  const sendValentineToBackend = useSendValentine(baseUrl);

  useEffect(() => {
    sendValentineToBackend(
      friendId,
      valentineId,
      backgroundId,
      message,
      isAnonymous
    );
  }, [message, isAnonymous]);

  useEffect(() => {
    useCreateUser(baseUrl);
  }, []);

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
            <Router>
              <Route
                path={PATHS.MAIN}
                element={<MainScreen baseUrl={baseUrl} />}
              />
              <Route
                path={PATHS.FRIEND_SELECT}
                element={
                  <SendValentineFriendSelect
                    baseUrl={baseUrl}
                    onSelectFriend={handleSelectFriend}
                  />
                }
              />
              <Route
                path={PATHS.DESIGN_SELECT}
                element={
                  <SendValentineDesignSelect
                    baseUrl={baseUrl}
                    onSelectDesign={handleSelectDesign}
                  />
                }
              />
              <Route
                path={PATHS.SEND_VALENTINE_MESSAGE}
                element={
                  <SendValentineMessage
                    baseUrl={baseUrl}
                    onSelectMessage={handleSelectMessage}
                  />
                }
              />
              <Route
                path={PATHS.SENT_VALENTINES}
                element={<SentValentineScreen baseUrl={baseUrl} />}
              />
              <Route
                path={PATHS.MY_VALENTINES}
                element={<MyValentinesScreen baseUrl={baseUrl} />}
              />
            </Router>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
