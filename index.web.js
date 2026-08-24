import {AppRegistry} from 'react-native';
import './src/generated/uniwind.web.css';
import App from './App';

const appName = 'EmomTimer';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
