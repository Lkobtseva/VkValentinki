import bridge from "@vkontakte/vk-bridge";

class VkApi {
  constructor() {
    this._token = "";
    this._userId = "";
    this._friendsAccessRequested = false;
  }
  getUserId() {
    return this._userId;
  }
  async init() {
    try {
      const authData = await bridge.send("VKWebAppGetAuthToken", {
        app_id: 51826188,
        scope: "",
      });
      this._token = authData.access_token;
      console.log("Authorization successful");

      // Получение информации о текущем пользователе
      const userInfo = await bridge.send("VKWebAppGetUserInfo");
      if (userInfo.id) {
        this._userId = userInfo.id;
      }
      return true;
    } catch (error) {
      console.error("Error during VK authorization:", error);
      return false;
    }
  }

  async getUserInfo() {
    try {
      // Получение информации о текущем пользователе
      const userInfo = await bridge.send("VKWebAppGetUserInfo", {
        app_id: 51826188,
      });
      if (userInfo.id) {
        this._userId = userInfo.id;
      }

      if (!this._userId) {
        console.error("User ID not set");
        return null;
      }

      return userInfo;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }

  async getRecipientInfoById(ids) {
    try {
      if (!ids) {
        console.error("User ID not provided_1");

        return null;
      }
      const response = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: ids,
          fields: "photo_200,first_name,last_name",
          v: "5.131",
          access_token: this._token,
          name_case: "nom",
        },
      });

      const userInfo = response.response;
      return userInfo;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }

  async getSenderInfoById(ids) {
    try {
      if (!ids) {
        console.error("User ID not provided_2");

        return null;
      }
      const response = await bridge.send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: ids,
          fields: "photo_200,first_name,last_name",
          v: "5.131",
          access_token: this._token,
          name_case: "nom",
        },
      });

      const userInfo = response.response;
      return userInfo;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }
  //доступ к друзьям
  async requestFriendsPermission() {
    try {
      const authData = await bridge.send("VKWebAppGetAuthToken", {
        app_id: 51826188,
        scope: "friends",
      });

      this._token = authData.access_token;
      return this._token;
    } catch (error) {
      console.error("Error requesting friends permission:", error);
      return false;
    }
  }
  getToken() {
    return this._token;
  }

  async getFriends() {
    try {
      const token = this._token;
      const friends = await bridge.send("VKWebAppCallAPIMethod", {
        method: "friends.get",
        params: {
          user_id: this._userId,
          fields: "photo_100,first_name,last_name",
          v: "5.131",
          access_token: token,
        },
      });
      return friends.response;
    } catch (error) {
      console.error("Error getting friends:", error);
      return null;
    }
  }

  async getRecipients() {
    try {
      const token = this._token;
      const friends = await bridge.send("VKWebAppCallAPIMethod", {
        method: "friends.get",
        params: {
          user_id: this._userId,
          fields: "photo_100,first_name,last_name",
          v: "5.131",
          access_token: token,
          name_case: "dat",
        },
      });
      return friends.response;
    } catch (error) {
      console.error("Error getting friends:", error);
      return null;
    }
  }

  //уведомления
  async requestNotificationsPermission() {
    try {
      const data = await bridge.send("VKWebAppAllowNotifications", {});
      return data.result;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }
}

const vkApi = new VkApi();

export default vkApi;
