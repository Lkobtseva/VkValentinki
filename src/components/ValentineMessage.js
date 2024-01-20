import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Input,
  Textarea,
  Button,
  Div,
  Checkbox,
  Switch,
  FormLayout,
  Group,
} from "@vkontakte/vkui";
import "../styles/main.css";
import Navigator from "./Navigator";
import "../styles/message.css";
import { MAX_GRID_LENGTH } from "@vkontakte/vkui/dist/components/GridAvatar/GridAvatar";

const SendValentineMessage = ({ go, onSend, onSelectMessage, onNext }) => {
  const [text, setText] = useState("");
  const [isAnon, setIsAnon] = useState(false);

  const handleSelectMessage = () => {
    onSelectMessage(text, isAnon);
    // onSend();
    onNext();
    console.log("message:", text);
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
                  <Switch
                    checked={isAnon}
                    onChange={() => setIsAnon(!isAnon)}
                  />
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
        </Div>
      </FormLayout>
      {/* Навигационная панель */}
      <Navigator go={go} />
    </Panel>
  );
};

SendValentineMessage.propTypes = {
  id: PropTypes.string,
  onSendMessage: PropTypes.func,
  onSendAnonymously: PropTypes.func,
  go: PropTypes.func,
  onSelectMessage: PropTypes.func,
  onSend: PropTypes.func,
  onNext: PropTypes.func,
};

export default SendValentineMessage;
