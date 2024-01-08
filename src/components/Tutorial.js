import { React, useEffect } from 'react';
import { Panel, PanelHeader, Group, Div, Button, Progress } from '@vkontakte/vkui';
import '../styles/Tutorial.css';
import vkApi from './Api';


const Tutorial = ({ id, tutorialStep, nextTutorialStep, go }) => {

  const renderTutorialContent = () => {
    useEffect(() => {
      const sendRequestToBackend = async (signature, vk_id) => {

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
        const headers = {
          'Authorization': authString,
          'Sign': signature,
          'Content-Type': 'application/json',
        };

        const requestBody = {
          vk_id
        };

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            console.log('User created successfully!');
          } else {
            console.error('Failed to create user:', response.statusText);
            console.log(requestBody);
            console.log(headers);

            if (response.status === 400) {
              console.log(response.json());
            }
          }
        } catch (error) {
          console.error('Error creating user:', error.message);
          console.log(requestBody);
          console.log(headers);
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

            console.log('Token and ID:', vkApi._token, userInfo.id);


            // Сортировка параметров по ключам
            const sortedKeys = Object.keys(sortedParams).sort();
            const sortedQueryString = sortedKeys.map(key => `${key}=${sortedParams[key]}`).join('&');

            // Генерация подписи
            const generateSignature = async (data, secret) => {
              console.log('Generating signature...');
              const encoder = new TextEncoder();
              const encodedData = encoder.encode(data);
              const encodedSecret = encoder.encode(secret);

              const key = await window.crypto.subtle.importKey(
                'raw',
                encodedSecret,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
              );

              const signature = await window.crypto.subtle.sign('HMAC', key, encodedData);
              console.log('Generated Signature:', signature);

              return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('');
            };

            const secretKey = '3ivZAriLc3b3OycmyV6R';
            const signature = await generateSignature(sortedQueryString, secretKey);
            console.log('Sending request to backend with signature:', signature);

            // Отправляем запрос на бэкенд для создания пользователя
            sendRequestToBackend(
              signature,
              userInfo.id,
              vkApi._token
            );
          } else {
            window.location.href = `https://oauth.vk.com/authorize?client_id=${id}&response_type=token&v=5.131`;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
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
