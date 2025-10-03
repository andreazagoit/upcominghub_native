import AsyncStorage from "@react-native-async-storage/async-storage";

// Web fallback for AsyncStorage
const webStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

// Check if we're running on web
const isWeb =
  typeof window !== "undefined" &&
  !window.navigator?.product?.includes("ReactNative");

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (isWeb) {
        return await webStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Storage getItem error:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (isWeb) {
        await webStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Storage setItem error:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (isWeb) {
        await webStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Storage removeItem error:", error);
    }
  },
};
