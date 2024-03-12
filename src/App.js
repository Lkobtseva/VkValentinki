import React, { useState, useEffect } from "react";
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  View,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./index.css";
import MainScreen from "./components/MainScreen";
import SendValentineDesignSelect from "./components/DesignSelect";
import SendValentineMessage from "./components/ValentineMessage";
import MyValentinesScreen from "./components/MyValentinesScreen";
import SendValentineFriendSelect from "./components/FriendSelect";
import SentValentineScreen from "./components/SentValentinesScreen";
import useCreateUser from "./hooks/useCreateUser";
import useSendValentine from "./hooks/useSendValentine";

const App = () => {
  const [activeView, setActiveView] = useState("main");
  const [friendId, setFriendId] = useState(null);
  const [ValentineId, setValentineId] = useState(null);
  const [BackgroundId, setBackgroundId] = useState(null);
  const [message, setMessage] = useState("");
  const [isAnonymous, setAnonymous] = useState(false);
  const baseUrl = 'https://valentine.itc-hub.ru/api/v1';

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

  //установка первого экрана
  const go = (view) => {
    setActiveView(view);
  };

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
      ValentineId,
      BackgroundId,
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
          <View activePanel={activeView}>
            <MainScreen id="main" go={go} baseUrl={baseUrl} />
            <SendValentineFriendSelect
              id="friend"
              go={go}
              baseUrl={baseUrl}
              onSelectFriend={handleSelectFriend}
              onNext={() => go("design")}
            />

            <SendValentineDesignSelect
              id="design"
              go={go}
              baseUrl={baseUrl}
              onSelectDesign={handleSelectDesign}
              onNext={() => go("sendValentineMessage")}
            />

            <SendValentineMessage
              id="sendValentineMessage"
              go={go}
              baseUrl={baseUrl}
              onNext={() => go("main")}
              onSelectMessage={(text, isAnon) =>
                handleSelectMessage(text, isAnon)
              }
            />
            <SentValentineScreen id="SentValentines" go={go} baseUrl={baseUrl} />
            <MyValentinesScreen id="myValentines" go={go} baseUrl={baseUrl} />
          </View>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
