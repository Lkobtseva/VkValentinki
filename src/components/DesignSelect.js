import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  PanelHeader,
  Div,
  Gallery,
  Avatar,
  Button,
  HorizontalScroll,
  Cell,
} from "@vkontakte/vkui";
import "../styles/design.css";
import Navigator from "./Navigator";

const SendValentineDesignSelect = ({ go, onNext, onSelectDesign }) => {
  const [selectedValentine, setSelectedValentine] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [valentines, setValentines] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedValentineId, setSelectedValentineId] = useState(null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://valentine.itc-hub.ru/api/v1/getvalentines",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const valentinesWithFullPaths = data.valentines.map((valentine) => ({
          ...valentine,
          image: `https://valentine.itc-hub.ru${valentine.image}`,
          icon_valentine: `https://valentine.itc-hub.ru${valentine.icon_valentine}`,
        }));

        const backgroundsWithFullPaths = data.backgrounds.map((background) => ({
          ...background,
          image_background: `https://valentine.itc-hub.ru${background.image_background}`,
          icon_background: `https://valentine.itc-hub.ru${background.icon_background}`,
        }));

        setValentines(valentinesWithFullPaths);
        setBackgrounds(backgroundsWithFullPaths);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleValentineClick = (id) => {
    const valentine = valentines.find((v) => v.id === id);
    setSelectedValentine(valentine);
    setSelectedValentineId(id);
  };

  const handleBackgroundClick = (id) => {
    const background = backgrounds.find((b) => b.id === id);
    setSelectedBackground(background);
    setSelectedBackgroundId(id);
  };

  const handleSelectDesign = () => {
    onSelectDesign(selectedValentineId, selectedBackgroundId);
    onNext();
  };

  return (
    <Panel id="design">
      <PanelHeader>Выберите дизайн</PanelHeader>
      <Div style={{ paddingLeft: "0", paddingRight: "0" }}>
        <Div
          className="design__page"
          style={{ paddingLeft: "0", paddingRight: "0" }}
        >
          <Div>
            <Div
              className="design__input"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px #ff3347 solid",
                borderRadius: "10px",
              }}
            >
              {selectedBackground && (
                <img
                  src={selectedBackground.image_background}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              )}

              {selectedValentine && (
                <img
                  src={selectedValentine.image}
                  style={{
                    position: "absolute",
                    width: "50%",
                    height: "50%",
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
                      className="background__icon"
                      size={55}
                      mode="app"
                      src={background.icon_background}
                      onClick={() => {
                        setSelectedBackground(background);
                        handleBackgroundClick(background.id);
                      }}
                      style={{ cursor: "pointer", border: "1px solid #c2bebe" }}
                    />
                  </Div>
                ))}
              </Gallery>
            </Div>

            <Div
              style={{
                marginTop: 0,
                //backgroundColor: "#EBEDF0",
                padding: "20px 0px 0px",
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
                      className="background__icon"
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
          <Div>
            <Button
              style={{
                color: "white",
                backgroundColor: "#FF3347",
                maxWidth: "250px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "10px",
              }}
              size="l"
              stretched
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
