import { React, useEffect } from 'react';
import { Panel, PanelHeader, Group, Div, Button, Progress } from '@vkontakte/vkui';
import '../styles/Tutorial.css';
import vkApi from './Api';
import bridge from '@vkontakte/vk-bridge';

const Tutorial = ({ id, tutorialStep, nextTutorialStep, go }) => {

  useEffect(() => {
    //получаем sign
    const configString = window.location.href;
    const url = new URL(configString);
    const params = url.searchParams;
    const signature = params.get('sign');

    const sendRequestToBackend = async (signature, vk_id, secretKey) => {
      function getAuthString() {
        const VK_PREFIX = 'vk_';
        const url = new URL(window.location.href);
        const params = url.searchParams;

        return params.toString()
          .split('&')
          .filter(p => p.startsWith(VK_PREFIX))
          .sort()
          .join('&');
      }

      const url = 'https://valentine.itc-hub.ru/api/v1/createuser';
      const authString = getAuthString();

      const formData = new FormData();
      formData.append('vk_id', vk_id);

      const headers = {
        'Authorization': authString,
        'Sign': signature,
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        });
        if (response.ok) {
          console.log('User created successfully!');
        } else {
          console.error('Failed to create user:', response.statusText);
          if (response.status === 400) {
            console.log(await response.json());
          }
        }
      } catch (error) {
        console.error('Error creating user:', error.message);
      }
    };

    const fetchData = async () => {
      try {
        console.log('Fetching user info...');
        await vkApi.init();

        // Get user ID  
        const userInfo = await vkApi.getUserInfo();

        if (vkApi._token && userInfo.id) {
          const sortedParams = {
            vk_id: userInfo.id,
            access_token: vkApi._token
          };

          //  параметры
          const sortedKeys = Object.keys(sortedParams).sort();
          const sortedQueryString = sortedKeys.map(key => `${key}=${sortedParams[key]}`).join('&');
          const secretKey = process.env.REACT_APP_SECRET_KEY || 'defaultSecretKey';

          // Отправка запроса на бэкенд для создания пользователя
          sendRequestToBackend(signature, userInfo.id, secretKey);
        } else {
          window.location.href = `https://oauth.vk.com/authorize?client_id=${id}&response_type=token&v=5.131`;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
