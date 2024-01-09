import bridge from '@vkontakte/vk-bridge';

class VkApi {
    constructor() {
        this._token = '';
        this._userId = '';
    }

    async init() {
        try {
            const authData = await bridge.send('VKWebAppGetAuthToken', { app_id: 51826188, scope: '' });
            this._token = authData.access_token;

            // Получение информации о текущем пользователе
            const userInfo = await bridge.send('VKWebAppGetUserInfo');
            if (userInfo.id) {
                this._userId = userInfo.id;
            }
        } catch (error) {
            console.error('Error during VK authorization:', error);
        }
    }

    async getUserInfo() {
        try {
            if (!this._userId) {
                console.error('User ID not set');
                return null;
            }

            const user = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'users.get',
                params: {
                    user_ids: this._userId,
                    fields: 'photo_200,first_name,last_name,',
                    v: '5.131',
                    access_token: this._token,
                },
            });

            return user.response[0];
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }
}

const vkApi = new VkApi();

export default vkApi;
