import '../shim.js';
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { ConnectionProvider } from './core/ConnectionProvider';
import { AppProvider } from './core/AppProvider';
import MainNavigator from './navigators/MainNavigator';

const App: React.FC = () => {
  return (
    <ConnectionProvider>
      <AppProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ThemeProvider>
            <StatusBar barStyle="light-content" />
            <MainNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </AppProvider>
    </ConnectionProvider>
  );
};

export default App;
