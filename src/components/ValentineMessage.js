import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Textarea,
  Button,
  Div,
  Switch,
  FormLayout,
} from "@vkontakte/vkui";
import "../styles/main.css";
import Navigator from "./Navigator";
import "../styles/message.css";

const SendValentineMessage = ({ go, onSelectMessage, onNext }) => {
  const [text, setText] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [attemptedSendEmpty, setAttemptedSendEmpty] = useState(false);

  const handleSelectMessage = () => {
    if (!text.trim()) {
      setAttemptedSendEmpty(true);
      return;
    }

    onSelectMessage(text, isAnon);
    localStorage.removeItem("selectedValentine");
    localStorage.removeItem("selectedBackground");
    onNext();
  };

  const handleGoBack = () => {
    const storedData = JSON.parse(localStorage.getItem("storedData")) || {};
    const {
      selectedValentineId,
      selectedBackgroundId,
      selectedValentine,
      selectedBackground,
    } = storedData;

    go("design", {
      selectedValentine,
      selectedBackground,
      selectedBackgroundId,
      selectedValentineId,
    });
  };

  const MAX_TEXT_LENGTH = 120; // Максимальное количество символов

  return (
    <Panel id={"sendingMessage"}>
      <PanelHeader>Напишите сообщение</PanelHeader>

      <FormLayout>
        <Div>
          <p style={{ color: attemptedSendEmpty ? "#FF3347" : "" }}>
            Напишите сообщение к валентинке
          </p>
          <Textarea
            placeholder="Поставьте хотя бы смайлик :)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_TEXT_LENGTH}
          />
        </Div>
        <Div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <p style={{ marginBottom: "8px" }}>Отправить Анонимно?</p>
          <Div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "-30px",
              paddingTop: 0,
            }}
          >
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "-20px",
              }}
            >
              <Switch checked={isAnon} onChange={() => setIsAnon(!isAnon)} />
              <p style={{ marginLeft: "8px" }}>{isAnon ? "Да" : "Нет"}</p>
            </Div>
          </Div>
        </Div>

        <Div>
          <Button
            style={{
              color: "white",
              color: text.trim() ? "white" : "black",
              backgroundColor: text.trim() ? "#FF3347" : "rgb(213 213 215)",
            }}
            size="l"
            stretched="true"
            onClick={handleSelectMessage}
            data-to="main"
          >
            Отправить
          </Button>
          <Button
            style={{
              color: "white",
              backgroundColor: "#FF3347",
              marginTop: "15px",
            }}
            size="l"
            stretched="true"
            onClick={handleGoBack}
          >
            Назад
          </Button>
        </Div>
      </FormLayout>
      {/* Навигационная панель */}
      <Navigator go={go} />
    </Panel>
  );
};

SendValentineMessage.propTypes = {
  go: PropTypes.func,
  onSelectMessage: PropTypes.func,
  onNext: PropTypes.func,
};

export default SendValentineMessage;
