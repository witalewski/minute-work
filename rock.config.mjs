import { platformAndroid } from '@rock-js/platform-android';
import { platformIOS } from '@rock-js/platform-ios';
import { pluginRepack } from '@rock-js/plugin-repack';

export default {
  bundler: pluginRepack(),
  platforms: {
    android: platformAndroid(),
    ios: platformIOS(),
  },
};
