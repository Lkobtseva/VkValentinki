import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "@happysanta/router";
import { Panel, Button } from "@vkontakte/vkui";

const PanelError = ({ nav }) => {
    const router = useRouter();

    const restartApp = () => {
        router.replacePage(Tutorial.PRELOADER);
    };

    return (
        <Panel nav={nav} id="error" centered>
            <h1>Что-то пошло не так..</h1>
            <Button
                value="Перезапустить приложение"
                size="m"
                onClick={restartApp}
            />
        </Panel>
    );
};

PanelError.propTypes = {
    nav: PropTypes.string,
};

export default PanelError;
