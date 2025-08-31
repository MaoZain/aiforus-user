import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    userRole: null, // 'user' or 'admin'
    username: null,
    useremail: null,
    token: null,
  }),
  actions: {
    login(data) {
      const { token, role, username, email } = data;
      this.userRole = role;
      this.username = username;
      this.useremail = email
      this.isAuthenticated = true
      this.setToken(token)
      // 持久化用户数据
      localStorage.setItem(
        "authData",
        JSON.stringify({ role, username, email })
      );
    },
    logout() {
      this.userRole = null;
      this.username = null;
      this.useremail = null;
      this.isAuthenticated = false
      this.delToken()
       // 清除持久化数据
      localStorage.removeItem("authData");
    },
    setToken(token) {
      this.authToken = token;
      localStorage.setItem("authToken", token);
    },
    delToken(){
      this.authToken = null;
      localStorage.removeItem("authToken");
    },
    restoreAuth() {
      // 从 localStorage 恢复 token
      const token = localStorage.getItem("authToken");
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
      }

      // 从 localStorage 恢复用户数据
      const authData = localStorage.getItem("authData");
      if (authData) {
        const { role, username, email } = JSON.parse(authData);
        this.userRole = role;
        this.username = username;
        this.useremail = email;
        this.isAuthenticated = true;
      }
    },
  },
});
