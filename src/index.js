import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import bridge from "@vkontakte/vk-bridge";

bridge
  .send("VKWebAppInit")
  .then((data) => {
    if (data.result) {
      // Приложение инициализировано
      ReactDOM.render(<App />, document.getElementById("root"));
    } else {
      // Ошибка
      console.error("Ошибка при инициализации VK Mini App");
    }
  })
  .catch((error) => {
    // Ошибка
    console.error(error);
  });
