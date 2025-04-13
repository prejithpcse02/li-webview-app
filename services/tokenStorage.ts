// li-app/services/tokenStorage.ts
import * as SecureStore from "expo-secure-store";

export const TokenStorage = {
  async setTokens(access: string, refresh: string) {
    await SecureStore.setItemAsync("access_token", access);
    await SecureStore.setItemAsync("refresh_token", refresh);
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync("access_token");
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync("refresh_token");
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
  },
};
