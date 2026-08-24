import { platformIOS } from '@rock-js/platform-ios';
import { pluginRepack } from '@rock-js/plugin-repack';

export default {
  bundler: pluginRepack(),
  platforms: {
    ios: platformIOS(),
  },
};
