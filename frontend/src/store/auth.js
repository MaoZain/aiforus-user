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
    },
    logout() {
      this.userRole = null;
      this.username = null;
      this.useremail = null;
      this.isAuthenticated = false
      this.delToken()
    },
    setToken(token) {
      this.authToken = token;
      localStorage.setItem("authToken", token);
    },
    delToken(){
      this.authToken = null;
      localStorage.removeItem("authToken");
    }
  },
});
