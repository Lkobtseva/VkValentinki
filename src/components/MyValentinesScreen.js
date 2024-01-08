import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Panel,
    PanelHeader,
    Gallery,
    Avatar,
    Group,
    Cell,
    Card,
    Button,
    Div,
} from '@vkontakte/vkui';

const MyValentinesScreen = ({ id, go }) => {
    const [mutualValentines, setMutualValentines] = useState([]);
    const [receivedValentines, setReceivedValentines] = useState([]);

    useEffect(() => {
        // ... 
    }, []);

    const renderValentines = (valentines) => (
        <Gallery slideWidth="100%" style={{ height: '150px' }}>
            {valentines.map((valentine) => (
                <div key={valentine.id}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Avatar src={valentine.sender.photo} size={72} />
                            <p>{valentine.sender.name}</p>
                        </div>
                        <img src={valentine.image} alt="Валентинка" />
                        <p>{valentine.message}</p>
                    </Card>
                </div>
            ))}
        </Gallery>
    );

    return (
        <Panel id={id}>
            <PanelHeader>Мои валентинки</PanelHeader>

            <Group>
                <Div>
                    <p>Взаимные симпатии</p>
                    {renderValentines(mutualValentines)}
                </Div>
            </Group>

            <Group>
                <Div>
                    <p>Полученные валентинки</p>
                    {renderValentines(receivedValentines)}
                </Div>
            </Group>

            <Div>
                <Button size="l" stretched onClick={() => go('main')}>
                    Назад к главной странице
                </Button>
            </Div>
        </Panel>
    );
};

MyValentinesScreen.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default MyValentinesScreen;
