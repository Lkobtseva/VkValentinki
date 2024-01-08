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
