import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import MainNavigator from './navigators/MainNavigator';
import StoreProvider from './store/Provider';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <MainNavigator />
      </SafeAreaProvider>
    </StoreProvider>
  );
};

export default App;
