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

  const handleSelectMessage = () => {
    onSelectMessage(text, isAnon);
    localStorage.removeItem("selectedValentine");
    localStorage.removeItem("selectedBackground");
    onNext();
  };

  const handleGoBack = () => {
    const selectedValentine = JSON.parse(
      localStorage.getItem("selectedValentine","selectedValentineId" )
    );
    const selectedBackground = JSON.parse(
      localStorage.getItem("selectedBackground", 'selectedBackgroundId')
    );
    const selectedValentineId = localStorage.getItem('selectedValentineId');
  const selectedBackgroundId = localStorage.getItem('selectedBackgroundId');

    go("design", { selectedValentine, selectedBackground, selectedBackgroundId,selectedValentineId });
  };

  const MAX_TEXT_LENGTH = 120; // Максимальное количество символов

  return (
    <Panel id={"sendingMessage"}>
      <PanelHeader>Напишите сообщение</PanelHeader>

      <FormLayout>
        <Div>
          <p>Хотите написать сообщение к валентинке?</p>
          <Textarea
            placeholder="Текст сообщения"
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
              backgroundColor: "#FF3347",
            }}
            size="l"
            stretched
            onClick={handleSelectMessage}
            data-to="main"
            go={go}
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
            stretched
            onClick={handleGoBack}
            go={go}
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
