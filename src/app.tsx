import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { AppProvider } from './core/AppProvider';
import MainNavigator from './navigators/MainNavigator';

const App: React.FC = () => {
  return (
    <AppProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <StatusBar barStyle="light-content" />
          <MainNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </AppProvider>
  );
};

export default App;
