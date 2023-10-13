import {AsyncStorage} from '@react-native-community/async-storage';
import {enableLoggingToConsole} from './environment';

export default Storage = () => {
  set = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      if (enableLoggingToConsole) {
        console.log(`Saved to storage. Key: ${key}, Value: ${value}`);
      }
    } catch (error) {
      if (enableLoggingToConsole) {
        console.error(error);
      }
    }
  };

  get = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null && enableLoggingToConsole) {
        console.log(value);
      }
    } catch (error) {
      if (enableLoggingToConsole) {
        console.error(error);
      }
    }
  };
};
