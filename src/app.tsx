import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { ConnectionProvider } from './core/ConnectionProvider';
import { TokenRegistryProvider } from './core/TokenRegistryProvider';
import MainNavigator from './navigators/MainNavigator';
import StoreProvider from './store/Provider';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <ConnectionProvider>
        <TokenRegistryProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <ThemeProvider>
              <StatusBar barStyle="dark-content" />
              <MainNavigator />
            </ThemeProvider>
          </SafeAreaProvider>
        </TokenRegistryProvider>
      </ConnectionProvider>
    </StoreProvider>
  );
};

export default App;
