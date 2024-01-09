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
} from "@vkontakte/vkui";

const SendValentineMessage = ({ id, onSendMessage, onSendAnonymously, go }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Код для отправки валентинки с сообщением и выбранными опциями
    // ...

    // После отправки переход на главную страницу
    onSendMessage();
  };

  return (
    <Panel id={id}>
      <PanelHeader>Напишите сообщение</PanelHeader>

      <FormLayout>
        <Div>
          <p>Хотите написать сообщение к валентинке?</p>
          <Textarea
            placeholder="Текс сообщения"
            onChange={(e) => setMessage(e.target.value)}
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
              marginLeft: "-40px",
            }}
          >
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "-20px",
              }}
            >
              <Checkbox /* onChange={(e) => onSendAnonymously(e.target.checked)} */
              />
              <p style={{ marginLeft: "8px" }}>Да</p>
            </Div>
            <Div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox /* onChange={(e) => onSendAnonymously(e.target.checked)} */
              />
              <p style={{ marginLeft: "8px" }}>Нет</p>
            </Div>
          </Div>
        </Div>
        <Div>
          <Button size="l" stretched onClick={() => go("main")} data-to="main">
            Отправить
          </Button>
        </Div>
      </FormLayout>
    </Panel>
  );
};

SendValentineMessage.propTypes = {
  id: PropTypes.string,
  onSendMessage: PropTypes.func,
  onSendAnonymously: PropTypes.func,
};

export default SendValentineMessage;
