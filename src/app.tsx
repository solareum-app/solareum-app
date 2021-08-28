import '../shim.js';
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { Root } from './core/AppProvider';
import MainNavigator from './navigators/MainNavigator';

const App: React.FC = () => {
  return (
    <Root>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <StatusBar barStyle="light-content" />
          <MainNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </Root>
  );
};

export default App;
