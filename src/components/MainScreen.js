import { React, useEffect}  from 'react';
import PropTypes from 'prop-types';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Avatar,
  Header,
  Button,
  Switch,
} from '@vkontakte/vkui';
import '../styles/main.css';
import heartIcon from '../images/heartIcon.svg';

const MainScreen = ({
  id,
  user,
  valentinesSent,
  valentinesReceived,
  mutualMatches,
  go,
}) => {

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
      //отправика Access Token на сервер 
      console.log('Access Token:', accessToken);

      // Отправляем запрос на бэкенд для создания пользователя
      sendRequestToBackend(accessToken);
    } else {
      window.location.href = `https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&v=5.131`;
    }
  }, []);


  return (
    <Panel id={'main'}>
      <PanelHeader>Название</PanelHeader>

      {/* Блок профиля */}
      <Group>
        <Div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar style={{ border: '5px solid #e76e83' }} src={user && user.photo_200} size={100} />
            <Div style={{ marginLeft: 8 }}>
              <Header level={5}>{`${user && user.first_name} ${user && user.last_name}`}</Header>
            </Div>
          </Div>
        </Div>
      </Group>

      {/* Блок уведомлений */}
      <Group>
        <Div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Header>Уведомления</Header>
          <Switch defaultChecked={true} />
        </Div>
      </Group>

      {/* Кнопки перехода */}
      <Group>
        <Div>
          <Button style={{
            color: 'white',
            backgroundColor: '#e76e83',
          }} size="l" stretched onClick={() => go('SendValentineFriendSelect')}>
            <Div><img style={{
              maxHeight: '20px',
              marginRight: '10px',
              paddingTop: '2px'
            }} src={heartIcon}></img>
            </Div>
            <span style={{ marginTop: '6%' }}>Отправить валентинку</span>
          </Button>
        </Div>
        <Div>
          <Button style={{
            color: 'white',
            backgroundColor: '#e76e83',
          }} size="l" stretched onClick={() => go('myValentines')}>
            <Div><img style={{
              maxHeight: '20px',
              marginRight: '10px',
              paddingTop: '2px'
            }} src={heartIcon}></img>
            </Div>
            <span style={{ marginTop: '9%' }}>Мои валентинки</span>

          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

MainScreen.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
  valentinesSent: PropTypes.number,
  valentinesReceived: PropTypes.number,
  mutualMatches: PropTypes.number,
  go: PropTypes.func,
};

export default MainScreen;
