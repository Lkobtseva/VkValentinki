import React from 'react';
import { Panel, PanelHeader, Group, Div, Button, Progress } from '@vkontakte/vkui';
import '../styles/Tutorial.css';


const Tutorial = ({ id, tutorialStep, nextTutorialStep, go }) => {
  const renderTutorialContent = () => {
    switch (tutorialStep) {
      case 1:
        return (
          <Div>
            <h2>Добро пожаловать в приложение "Валентинки"!</h2>
            <p>Создайте уникальные валентинки и отправляйте их своим друзьям.</p>
          </Div>
        );
      case 2:
        return (
          <Div>
            <h2>Что умеет приложение?</h2>
            <p>
              Приложение позволяет вам самостоятельно создавать валентинки, выбирать получателя и отправлять их анонимно или не анонимно.
            </p>
          </Div>
        );
      case 3:
        return (
          <Div>
            <h2>Начнем работу!</h2>
            <Button style={{
              color: 'white',
              backgroundColor: '#e76e83',
            }} size="l" onClick={() => go('main')} data-to="main">
              Создать валентинку
            </Button>
          </Div>
        );
      default:
        return null;
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Обучение</PanelHeader>
      <Group>
        {renderTutorialContent()}
        <Progress value={tutorialStep} max={3} />
        {tutorialStep < 3 && (
          <Div>
            <Button style={{
              color: 'white',
              backgroundColor: '#e76e83',
            }} size="l" onClick={nextTutorialStep}>
              Далее
            </Button>
          </Div>
        )}
      </Group>
    </Panel>
  );
};

export default Tutorial;
