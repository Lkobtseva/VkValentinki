import {React, useEffect} from 'react';
import { Panel, PanelHeader, Group, Div, Button, Progress } from '@vkontakte/vkui';
import '../styles/Tutorial.css';


const Tutorial = ({ id, tutorialStep, nextTutorialStep, go }) => {

  const renderTutorialContent = () => {

    useEffect(() => {
      const sendRequestToBackend = async (accessToken) => {
        const url = 'https://valentine.itc-hub.ru/api/v1/createuser';
  
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };
  
        const requestBody = {
          // 
        };
  
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });
  
          if (response.ok) {
            console.log('User created successfully!');
            // действия после успешного создания пользователя
          } else {
            console.error('Failed to create user:', response.statusText);
          }
        } catch (error) {
          console.error('Error creating user:', error.message);
        }
      };
  
      const clientId = '51826188'; // ID приложения
      const redirectUri = 'https://yourdomain.com/auth/vk/callback'; // Зарегистрированный redirect URI
  
      const getAccessTokenFromUrl = () => {
        const hashParams = window.location.hash.substr(1).split('&');
        const params = hashParams.reduce((acc, param) => {
          const [key, value] = param.split('=');
          acc[key] = value;
          return acc;
        }, {});
        return params.access_token;
      };
  
      const accessToken = getAccessTokenFromUrl();
  
      if (accessToken) {
        //Отправляем Access Token на сервер 
        console.log('Access Token:', accessToken);
  
        // Отправляем запрос на бэкенд для создания пользователя
        sendRequestToBackend(accessToken);
      } else {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&v=5.131`;
      }
    }, []);

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
