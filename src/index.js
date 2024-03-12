import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import bridge from "@vkontakte/vk-bridge";
import ErrorBoundary from "./components/ErrorBoundary";

const root = document.getElementById("root");

bridge
  .send("VKWebAppInit")
  .then((data) => {
    if (data.result) {
      // Приложение инициализировано
      ReactDOM.render(
        <Router>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Router>,
        root 
      );
    } else {
      console.error("Ошибка при инициализации VK Mini App");
    }
  })
  .catch((error) => {
    console.error(error);
  });
