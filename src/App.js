import React, { useState, useEffect, useRef } from 'react';
import {
	ConfigProvider,
	AdaptivityProvider,
	AppRoot,
	View,
	ModalRoot,
	ModalPage,
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import Tutorial from './components/Tutorial';
import MainScreen from './components/MainScreen';
import SendValentineDesignSelect from './components/DesignSelect';
import SendValentineMessage from './components/ValentineMessage';
import SendValentineSuccess from './components/SendValentineSuccess';
import MyValentinesScreen from './components/MyValentinesScreen';
import SendValentineFriendSelect from './components/FriendSelect';
import vkApi from './components/Api';

const App = () => {
	const [activeView, setActiveView] = useState('tutorial');
	const [popout, setPopout] = useState(null);
	const [tutorialStep, setTutorialStep] = useState(1);
	const [user, setUser] = useState({});
	const [selectedFriend, setSelectedFriend] = useState(null);
	const [userFriends, setUserFriends] = useState([]);


	//инициализация приложения
	useEffect(() => {
		let isMounted = true;

		const initApp = async () => {
			try {
				await vkApi.init();
				const userInfo = await vkApi.getUserInfo();
				if (isMounted) {
					setUser(userInfo);
					setPopout(null);
				}
			} catch (error) {
				console.error(error);
			}
		};

		initApp();

		return () => {
			isMounted = false;
		};
	}, []);

	const go = (view) => {
		setActiveView(view);
	};

	const onCloseModal = () => setPopout(null);

	// tutorial
	const nextTutorialStep = () => {
		setTutorialStep((prevStep) => prevStep + 1);
	};

	const handleSendValentine = (message, isAnonymous) => {
		// Логика отправки валентинки
		// ...

		// Переход на экран успешной отправки
		go('sendValentineSuccess');
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<View activePanel={activeView} popout={popout}>
						<Tutorial
							id='tutorial'
							tutorialStep={tutorialStep}
							nextTutorialStep={nextTutorialStep}
							go={go}
						/>

						<MainScreen id="main" go={go} user={user} />
						<SendValentineFriendSelect
							id="SendValentineFriendSelect"
							go={go}
							friends={userFriends}
							onNext={() => go('sendValentineDesignSelect')}
						/>

						<SendValentineDesignSelect
							id="sendValentineDesignSelect"
							go={go}
							onNext={() => go('sendValentineMessage')}
						/>

						<SendValentineMessage
							id="sendValentineMessage"
							go={go}
							onSend={handleSendValentine}
						/>

						<SendValentineSuccess
							id="sendValentineSuccess"
							go={go}
						/>

						<MyValentinesScreen id="myValentines" go={go} />
					</View>

					<ModalRoot activeModal={null}>
						<ModalPage id="sendValentineModal" onClose={onCloseModal}>
							{/* Содержимое модального окна для отправки валентинки */}
						</ModalPage>
					</ModalRoot>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
};

export default App;
