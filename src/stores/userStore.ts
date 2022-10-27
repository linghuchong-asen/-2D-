import { defineStore } from "pinia";

interface UserStore {
  user: {
    userName: string;
    password: string;
  };
}

export const useUserStore = defineStore({
  id: "userStore",
  state: (): UserStore => ({
    user: {
      userName: "",
      password: "",
    },
  }),
  getters: {},
  actions: {
    setUserName(userName: string) {
      this.user.userName = userName;
    },
  },
});
