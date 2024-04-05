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
import { useNavigation } from "../your/navigation/context";
import { PATHS } from "./utils/const";
const MAX_TEXT_LENGTH = 120;
import styled from 'styled-components';

const SendValentineMessage = ({ onSelectMessage }) => {
  const [text, setText] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [attemptedSendEmpty, setAttemptedSendEmpty] = useState(false);
  const { navigate } = useNavigation();

  const handleSelectMessage = () => {
    if (!text.trim()) {
      setAttemptedSendEmpty(true);
      return;
    }

    onSelectMessage(text, isAnon);
    localStorage.removeItem("selectedValentine");
    localStorage.removeItem("selectedBackground");
    navigate(PATHS.MAIN);
  };

  const handleGoBack = () => {
    const storedData = JSON.parse(localStorage.getItem("storedData")) || {};
    const {
      selectedValentineId,
      selectedBackgroundId,
      selectedValentine,
      selectedBackground,
    } = storedData;

    navigate(PATHS.DESIGN_SELECT, {
      selectedValentine,
      selectedBackground,
      selectedBackgroundId,
      selectedValentineId,
    });
  };

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
        <QuestionDiv>
          <QuestionP>Отправить Анонимно?</QuestionP>
          <SwitchContainer>
            <SwitchDiv>
              <Switch checked={isAnon} onChange={() => setIsAnon(!isAnon)} />
              <QuestionP>{isAnon ? "Да" : "Нет"}</QuestionP>
            </SwitchDiv>
          </SwitchContainer>
        </QuestionDiv>

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
          <BackButton size="l" stretched="true" onClick={handleGoBack}>
            Назад
          </BackButton>
        </Div>
      </FormLayout>
      {/* Навигационная панель */}
      <Navigator />
    </Panel>
  );
};

// Styled components
const BackButton = styled(Button)`
  && {
    color: white;
    background-color: #ff3347;
    margin-top: 15px;
  }
`;

const SwitchDiv = styled(Div)`
  && {
    display: flex;
    align-items: center;
    margin-bottom: -20px;
  }
`;

const SwitchContainer = styled(Div)`
  && {
    display: flex;
    flex-direction: column;
    margin-left: -30px;
    padding-top: 0;
  }
`;

const QuestionP = styled.p`
  margin-left: 8px;
`;

const QuestionDiv = styled(Div)`
  && {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
`;

SendValentineMessage.propTypes = {
  onSelectMessage: PropTypes.func,
};

export default SendValentineMessage;
