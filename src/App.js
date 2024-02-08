import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  View,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./index.css";
import Tutorial from "./components/Tutorial";
import MainScreen from "./components/MainScreen";
import SendValentineDesignSelect from "./components/DesignSelect";
import SendValentineMessage from "./components/ValentineMessage";
import CustomNotification from "./components/SendValentineSuccess";
import MyValentinesScreen from "./components/MyValentinesScreen";
import SendValentineFriendSelect from "./components/FriendSelect";
import SentValentineScreen from "./components/SentValentinesScreen";
import vkApi from "./utils/Api";

const App = () => {
  const [activeView, setActiveView] = useState("tutorial");
  const [tutorialStep, setTutorialStep] = useState(1);
  const [userFriends, setUserFriends] = useState([]);
  const [friendId, setFriendId] = useState(null);
  const [ValentineId, setValentineId] = useState(null);
  const [BackgroundId, setBackgroundId] = useState(null);
  const [message, setMessage] = useState("");
  const [isAnonymous, setAnonymous] = useState(false);

  //инициализация приложения
 useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      try {
  
        if (isMounted) {
          console.log('success')
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

  const go = (view) => {
    setActiveView(view);
  };

  const nextTutorialStep = () => {
    setTutorialStep((prevStep) => prevStep + 1);
  };

  const handleSelectDesign = (selectedValentineId, selectedBackgroundId) => {
    setValentineId(selectedValentineId);
    setBackgroundId(selectedBackgroundId);
  };

  const handleSelectFriend = (selectedFriendId) => {
    setFriendId(selectedFriendId);
  };

  const handleSelectMessage = (text, isAnon) => {
    setMessage(text);
    setAnonymous(isAnon);
  };

  //чтобы убедиться, что все корректно установились все данные для валентинки
  useEffect(() => {
    sendValentineToBackend();
  }, [message, isAnonymous]);

  //отправка валентинки
  const sendValentineToBackend = async () => {
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
    const userSenderVkId = userInfo?.id.toString();

    try {
      const response = await fetch(
        "https://valentine.itc-hub.ru/api/v1/sendvalentine",
        {
          method: "POST",
          headers: {
            Authorization: authString,
            Sign: signature,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_sender_vk_id: userSenderVkId,
            user_recipient_vk_id: friendId,
            valentine_id: ValentineId,
            background_id: BackgroundId,
            text: message,
            anonim: isAnonymous,
          }),
        }
      );

      if (response.ok) {
        const container = document.createElement("div");
        document.body.appendChild(container);

        const customNotification = (
          <CustomNotification
            onClose={() => {
              ReactDOM.unmountComponentAtNode(container);
              document.body.removeChild(container);
            }}
          />
        );
        ReactDOM.render(customNotification, container);
      } else {
        console.error("Ошибка при отправке данных на бэкенд");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных на бэкенд:", error);
    }
  };

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <View activePanel={activeView}>
            <Tutorial
              id="tutorial"
              tutorialStep={tutorialStep}
              nextTutorialStep={nextTutorialStep}
              go={go}
            />

            <MainScreen id="main" go={go} />
            <SendValentineFriendSelect
              id="friend"
              go={go}
              friends={userFriends}
              onSelectFriend={handleSelectFriend}
              onNext={() => go("design")}
            />

            <SendValentineDesignSelect
              id="design"
              go={go}
              onSelectDesign={handleSelectDesign}
              onNext={() => go("sendValentineMessage")}
            />

            <SendValentineMessage
              id="sendValentineMessage"
              go={go}
              onNext={() => go("main")}
              onSelectMessage={handleSelectMessage}
            />
            <SentValentineScreen id="SentValentines" go={go} />
            <MyValentinesScreen id="myValentines" go={go} />
          </View>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
