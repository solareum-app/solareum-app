import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';

import CreateWallet from '../screens/CreateWallet';
import GetStarted from '../screens/GetStarted';
import ImportWallet from '../screens/ImportWallet';
import Notifications from '../screens/Notifications';
import Receive from '../screens/Receive';
import Send from '../screens/Send';
import Settings from '../screens/Settings';
import { Wallet as SettingWallet } from '../screens/Settings/Wallet';
import TokensListed from '../screens/TokensListed';
import Transaction from '../screens/Transaction';
import Token from '../screens/Token';
import { getListWallet } from '../storage/WalletCollection';

import { HomeScreen } from './HomeScreen';
import { COLORS } from '../theme/colors';
import Routes from './Routes';

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const navigationRef = useRef(null);

  const checkInitScreen = async () => {
    const wallets = await getListWallet();
    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }
    // TODO: Hide splashscreen after all step have completed
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={checkInitScreen}>
      <Host>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              color: COLORS.white0,
              shadowColor: 'transparent',
            },
            headerStyle: {
              backgroundColor: COLORS.dark2,
              shadowColor: COLORS.dark4,
            },
          }}
        >
          <Stack.Screen
            name={Routes.Home}
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={Routes.GetStarted} component={GetStarted} />
          <Stack.Screen name={Routes.CreateWallet} component={CreateWallet} />
          <Stack.Screen name={Routes.ImportWallet} component={ImportWallet} />
          <Stack.Screen name={Routes.Notifications} component={Notifications} />
          <Stack.Screen name={Routes.Receive} component={Receive} />
          <Stack.Screen name={Routes.Send} component={Send} />
          <Stack.Screen name={Routes.Settings} component={Settings} />
          <Stack.Screen name={Routes.TokensListed} component={TokensListed} />
          <Stack.Screen name={Routes.Transaction} component={Transaction} />
          <Stack.Screen name={Routes.Token} component={Token} />
          <Stack.Screen name={Routes.SettingWallet} component={SettingWallet} />
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
