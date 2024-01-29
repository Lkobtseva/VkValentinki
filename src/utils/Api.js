import bridge from "@vkontakte/vk-bridge";

class VkApi {
  constructor() {
    this._token = "";
    this._userId = "";
  }

  async init() {
    try {
      const authData = await bridge.send("VKWebAppGetAuthToken", {
        app_id: 51826188,
        scope: "friends",
      });
      this._token = authData.access_token;

      // Получение информации о текущем пользователе
      const userInfo = await bridge.send("VKWebAppGetUserInfo");
      if (userInfo.id) {
        this._userId = userInfo.id;
      }
    } catch (error) {
      console.error("Error during VK authorization:", error);
    }
  }

  async getUserInfo() {
    try {
      if (!this._userId) {
        console.error("User ID not set");
        return null;
      }
      const user = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: this._userId,
          fields: "photo_200,first_name,last_name,",
          v: "5.131",
          access_token: this._token,
        },
      });

      return user.response[0];
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }

  async getUserInfoById(ids) {
    try {
      if (!ids) {
        console.error("User ID not provided");

        return null;
      }
      const response = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: ids,
          fields: "photo_200,first_name,last_name",
          v: "5.131",
          access_token: this._token,
          name_case: 'dat',
        },
      });

      const userInfo = response.response;
    if (userInfo && userInfo.length > 0) {
       userInfo.forEach(user => {
          const firstName = user.first_name;
          const lastName = user.last_name;
      
          if (firstName && lastName) {
            //console.log(`Пользователь: ${firstName} ${lastName}`);
          } else {
            console.error("Отсутствуют данные о пользователе или не хватает свойств");
          }
        });
      return userInfo;
      } else {
        console.error("User info not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }
  
  async getSenderInfoById(ids) {
    try {
      if (!ids) {
        console.error("User ID not provided");

        return null;
      }
      const response = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: ids,
          fields: "photo_200,first_name,last_name",
          v: "5.131",
          access_token: this._token,
          name_case: 'nom',
        },
      });

      const userInfo = response.response;
      if (userInfo && userInfo.length > 0) {
        userInfo.forEach(user => {
          const firstName = user.first_name;
          const lastName = user.last_name;
      
          /*if (firstName && lastName) {
            console.log(`Пользователь: ${firstName} ${lastName}`);
          } else {
            console.error("Отсутствуют данные о пользователе или не хватает свойств");
          }*/
        });
      return userInfo;
      } else {
        console.error("User info not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }


  async getFriends() {
    try {
      const friends = await bridge.send("VKWebAppCallAPIMethod", {
        method: "friends.get",
        params: {
          user_id: this._userId,
          fields: "photo_100,first_name,last_name",
          v: "5.131",
          access_token: this._token,
        },
      });

      return friends.response;
    } catch (error) {
      return null;
    }
  }
}

const vkApi = new VkApi();

export default vkApi;
