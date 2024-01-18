import React, { useEffect } from "react";
import {  Div, } from "@vkontakte/vkui";
import "../styles/main.css";

const CustomNotification = ({ recipientName, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <Div className="custom-notification">
      <p>Валентинка успешно отправлена!</p>
    </Div>
  );
};

export default CustomNotification;
