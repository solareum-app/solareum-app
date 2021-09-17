/**
 * @format
 */

import './shim';
import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
