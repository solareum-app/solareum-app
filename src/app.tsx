import { Root } from '@Core/AppProvider';
import MainNavigator from '@Navigators/MainNavigator';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider
} from 'react-native-safe-area-context';

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
