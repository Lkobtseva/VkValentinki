import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Div,
  Gallery,
  Avatar,
  Button,
} from "@vkontakte/vkui";
import "../styles/design.css";
import Navigator from "./Navigator";
import baseBackground from "../images/baseVal.svg";
import useValentinesData from "../hooks/useValentinesData";
import { useNavigation } from "../your/navigation/context";
import { PATHS } from "./utils/const";
import { styled } from "styled-components";

const SendValentineDesignSelect = ({ onSelectDesign, baseUrl }) => {
  const getInitialState = (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const [selectedValentineId, setSelectedValentineId] = useState(getInitialState("selectedValentineId"));
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(getInitialState("selectedBackgroundId"));
  const [selectedValentine, setSelectedValentine] = useState(getInitialState("selectedValentine"));
  const [selectedBackground, setSelectedBackground] = useState(getInitialState("selectedBackground"));
  const { valentines, backgrounds } = useValentinesData(baseUrl);
  const { navigate } = useNavigation();

  //общая функция для сохранения выбранных фона и валентинки в LocalStorage
  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  //выбор и подстановка валентинки
  const handleValentineClick = (id) => {
    const valentine = valentines.find((v) => v.id === id);
    setSelectedValentine(valentine);
    setSelectedValentineId(id);
  };

  //выбор и подстановка фона
  const handleBackgroundClick = (id) => {
    const background = backgrounds.find((b) => b.id === id);
    setSelectedBackground(background);
    setSelectedBackgroundId(id);
  };

  //выбор фона и валентинки для отправки
  const handleSelectDesign = () => {
    onSelectDesign(selectedValentineId, selectedBackgroundId);
    saveToLocalStorage("selectedValentineId", selectedValentineId);
    saveToLocalStorage("selectedBackgroundId", selectedBackgroundId);
    saveToLocalStorage("selectedValentine", selectedValentine);
    saveToLocalStorage("selectedBackground", selectedBackground);
    navigate(PATHS.SEND_VALENTINE_MESSAGE);
  };

  return (
    <DesignPage id="design">
      <PanelHeader>Выберите дизайн</PanelHeader>
      <MainDiv>
        <DesignPage>
          <Div>
            <DesignInput
              selectedBackground={selectedBackground}
              selectedValentine={selectedValentine}
            >
              {selectedBackground ? (
                <StyledBackgroundImage
                  alt="background"
                  className="baseBackground"
                  src={selectedBackground?.image_background}
                />
              ) : null }

              {selectedValentine ? (
                <StyledValentineImage
                  src={selectedValentine?.image}
                  alt="valentine"
                />
              ) : null }
            </DesignInput>
          </Div>

          <Div style={{ padding: 0 }}>
            <GalleryDiv>
              <VkGallery slideWidth="100px" align="center">
                {backgrounds?.map((background) => (
                  <AvatarDiv key={background.id}>
                    <Avatar
                      className={`background__icon ${
                        selectedBackgroundId === background.id ? "selected" : ""
                      }`}
                      size={55}
                      mode="app"
                      src={background?.icon_background}
                      onClick={() => {
                        setSelectedBackground(background);
                        handleBackgroundClick(background.id);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </AvatarDiv>
                ))}
              </VkGallery>
            </GalleryDiv>

            <GalleryDiv2>
              <VkGallery2
                slideWidth="100px"
                align="center"
              >
                {valentines?.map((valentine) => (
                  <Div
                    key={valentine.id}
                    style={{ marginRight: "20px", padding: 0 }}
                  >
                    <Avatar
                      className={`background__icon ${
                        selectedValentineId === valentine.id ? "selected" : ""
                      }`}
                      size={100}
                      mode="app"
                      src={valentine.icon_valentine}
                      onClick={() => {
                        setSelectedValentine(valentine);
                        handleValentineClick(valentine.id);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </Div>
                ))}
              </VkGallery2>
            </GalleryDiv2>
          </Div>
          <Div style={{ marginBottom: "100px" }}>
            <StyledButton
              selectedBackground={selectedBackground}
              selectedValentine={selectedValentine}
              size="l"
              stretched="true"
              disabled={!selectedBackground || !selectedValentine}
              onClick={handleSelectDesign}
            >
              Далее
            </StyledButton>
          </Div>
        </DesignPage>
      </MainDiv>
      <Navigator />
    </DesignPage>
  );
};

// Styled components
const MainDiv = styled(Div)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;

const DesignPage = styled(Panel)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;

const VkGallery = styled(Gallery)`
  && {
    height: 60px;
    margin-bottom: 20px;
  }
`;

const VkGallery2 = styled(Gallery)`
  && {
    padding: 0 0 20px;
  }
`;

const AvatarDiv = styled(Div)`
  && {
    margin-right: 20px;
    min-height: 30px;
    max-width: 50px;
    padding: 0;
  }
`;

const DesignInput = styled(Div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgb(193 192 192);
  border-radius: 10px;
  background-color: white;
  background-size: contain;
  background-image: ${({ selectedBackground, selectedValentine }) =>
    selectedBackground || selectedValentine ? "" : `url(${baseBackground})`};
`;

const StyledBackgroundImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const StyledValentineImage = styled.img`
  position: absolute;
  width: 84%;
  height: 80%;
  border-radius: 10px;
  object-fit: cover;
`;

const StyledButton = styled(Button)`
  && {
    color: ${({ selectedBackground, selectedValentine }) =>
      selectedBackground && selectedValentine ? "white" : "black"};
    background-color: ${({ selectedBackground, selectedValentine }) =>
      selectedBackground && selectedValentine ? "#FF3347" : "rgb(223 223 223)"};
    max-width: 250px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
  }
`;

const GalleryDiv = styled(Div)`
  && {
    margin-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
  }
`;

const GalleryDiv2 = styled(Div)`
  && {
    margin-top: 0;
    padding: 0px 0px 0px;
  }
`;

SendValentineDesignSelect.propTypes = {
  id: PropTypes.string,
  onSelectDesign: PropTypes.func,
};

export default SendValentineDesignSelect;
