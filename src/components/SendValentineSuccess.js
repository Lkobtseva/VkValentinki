import React, { useEffect } from "react";
import { Div, Snackbar } from "@vkontakte/vkui";
import "../styles/main.css";

const CustomNotification = ({ onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <Snackbar className="custom-notification">
      <p style={{ textAlign: "center" }}>Валентинка успешно отправлена!</p>
    </Snackbar>
  );
};

export default CustomNotification;
