import { React, useEffect } from 'react';
import { Panel, PanelHeader, Group, Div, Button, Progress } from '@vkontakte/vkui';
import '../styles/Tutorial.css';
import vkApi from './Api';

const Tutorial = ({ id, tutorialStep, nextTutorialStep, go }) => {

  const renderTutorialContent = () => {

    useEffect(() => {
      const sendRequestToBackend = async (signature, vk_id, access_token) => {
        const url = 'https://valentine.itc-hub.ru/api/v1/createuser';

        const headers = {
          'Authorization': `Bearer ${access_token}`,
          'Sign': signature,
          'Content-Type': 'application/json',
        };

        const requestBody = {
          vk_id,
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
      const userInfoWithToken = vkApi.init();

      if (userInfoWithToken) {
        const { access_token, id } = userInfoWithToken;

        const sortedParams = {
          vk_id: id,
          access_token: access_token,
        };

        // Сортировка параметров по ключам
        const sortedKeys = Object.keys(sortedParams).sort();
        const sortedQueryString = sortedKeys.map(key => `${key}=${sortedParams[key]}`).join('&');

        // Генерация подписи
        const generateSignature = async (data, secret) => {
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
          return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('');
        };

        const secretKey = '3ivZAriLc3b3OycmyV6R';
        const signature = generateSignature(sortedQueryString, secretKey);

        console.log('Generated Signature:', signature);

        // Отправляем запрос на бэкенд для создания пользователя
        sendRequestToBackend(signature, sortedParams.vk_id, access_token);
      } else {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${clientId}&response_type=token&v=5.131`;
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
