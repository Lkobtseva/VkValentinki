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
const SendValentineDesignSelect = ({ go, onNext, onSelectDesign, baseUrl }) => {

  const getInitialState = (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const [selectedValentineId, setSelectedValentineId] = useState(getInitialState("selectedValentineId"));
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(getInitialState("selectedBackgroundId"));
  const [selectedValentine, setSelectedValentine] = useState(getInitialState("selectedValentine"));
  const [selectedBackground, setSelectedBackground] = useState(getInitialState("selectedBackground"));
  const { valentines, backgrounds } = useValentinesData(baseUrl);

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
    onNext();
  };

  return (
    <Panel id="design">
      <PanelHeader>Выберите дизайн</PanelHeader>
      <Div style={{ paddingLeft: "0", paddingRight: "0" }}>
        <Div
          className="design__page"
          style={{
            paddingLeft: "0",
            paddingRight: "0",
            maxHeight: "800px",
            overflowY: "auto",
          }}
        >
          <Div>
            <Div
              className="design__input"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid rgb(193 192 192)",
                borderRadius: "10px",
                backgroundSize: "contain",
                backgroundColor: "white",
                backgroundImage:
                  selectedBackground || selectedValentine
                    ? ""
                    : `url(${baseBackground})`,
              }}
            >
              {selectedBackground && (
                <img
                  className="baseBackground"
                  src={selectedBackground.image_background}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              )}

              {selectedValentine && (
                <img
                  src={selectedValentine.image}
                  style={{
                    position: "absolute",
                    width: "84%",
                    height: "80%",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              )}
            </Div>
          </Div>

          <Div style={{ padding: 0 }}>
            <Div
              style={{
                marginTop: 0,
                paddingBottom: "0px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <Gallery
                slideWidth="100px"
                align="center"
                style={{ height: "60px", marginBottom: "20px" }}
              >
                {backgrounds.map((background) => (
                  <Div
                    key={background.id}
                    style={{
                      marginRight: "20px",
                      minHeight: "30px",
                      maxWidth: "50px",
                      padding: 0,
                    }}
                  >
                    <Avatar
                      className={`background__icon ${selectedBackgroundId === background.id ? "selected" : ""
                        }`}
                      size={55}
                      mode="app"
                      src={background.icon_background}
                      onClick={() => {
                        setSelectedBackground(background);
                        handleBackgroundClick(background.id);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </Div>
                ))}
              </Gallery>
            </Div>

            <Div
              style={{
                marginTop: 0,
                padding: "0px 0px 0px",
              }}
            >
              <Gallery
                slideWidth="100px"
                align="center"
                style={{ padding: "0 0 20px" }}
              >
                {valentines.map((valentine) => (
                  <Div
                    key={valentine.id}
                    style={{ marginRight: "20px", padding: 0 }}
                  >
                    <Avatar
                      className={`background__icon ${selectedValentineId === valentine.id ? "selected" : ""
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
              </Gallery>
            </Div>
          </Div>
          <Div style={{ marginBottom: "100px" }}>
            <Button
              style={{
                color:
                  selectedBackground && selectedValentine ? "white" : "black",
                backgroundColor:
                  selectedBackground && selectedValentine
                    ? "#FF3347"
                    : "rgb(223 223 223)",
                maxWidth: "250px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "10px",
              }}
              size="l"
              stretched="true"
              disabled={!selectedBackground || !selectedValentine}
              onClick={handleSelectDesign}
            >
              Далее
            </Button>
          </Div>
        </Div>
      </Div>
      <Navigator go={go} />
    </Panel>
  );
};

SendValentineDesignSelect.propTypes = {
  id: PropTypes.string,
  onSelectDesign: PropTypes.func,
  onNext: PropTypes.func,
  go: PropTypes.func,
};

export default SendValentineDesignSelect;
