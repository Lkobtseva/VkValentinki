import React, { useEffect } from "react";
import { Div } from "@vkontakte/vkui";
import "../styles/main.css";

const CustomNotification = ({ onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <Div className="custom-notification">
      <p style={{ textAlign: "center" }}>Валентинка успешно отправлена!</p>
    </Div>
  );
};

export default CustomNotification;
