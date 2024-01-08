import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Div, Button } from '@vkontakte/vkui';

const SendValentineSuccess = ({ id, go }) => {
    return (
        <Panel id={id}>
            <PanelHeader>Отправлено</PanelHeader>

            <Div>
                <h2>Ваша валентинка успешно отправлена!</h2>
            </Div>

            <Div>
                <Button size="l" stretched onClick={() => go('main')}>
                    Вернуться на главную
                </Button>
            </Div>
        </Panel>
    );
};

SendValentineSuccess.propTypes = {
    id: PropTypes.string,
    go: PropTypes.func,
};

export default SendValentineSuccess;
