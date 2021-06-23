import React, { useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import { PinStatus } from '@haskkor/react-native-pincode/src/PinCode';

import CreateWallet from '../screens/CreateWallet';
import GetStarted from '../screens/GetStarted';
import ImportWallet from '../screens/ImportWallet';
import Notifications from '../screens/Notifications';
import PassCode from '../screens/PassCode';
import Receive from '../screens/Receive';
import Send from '../screens/Send';
import Settings from '../screens/Settings';
import Security from '../screens/Settings/Security';
import TokensListed from '../screens/TokensListed';
import Transaction from '../screens/Transaction';
import Token from '../screens/Token';
// import { getListWallet } from '../storage/WalletCollection';

import { HomeScreen } from './HomeScreen';
import { COLORS } from '../theme/colors';
import Routes from './Routes';

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const navigationRef = useRef(null);
  const [appState, setAppState] = React.useState<AppStateStatus>('active');

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState?.match(/inactive|background/) && nextAppState === 'active') {
        navigationRef.current?.navigate(Routes.PassCode, {
          PINCodeStatus: PinStatus.enter,
          showBackButton: false,
        });
      }

      setAppState(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appState, navigationRef]);

  const init = async () => {
    hasUserSetPinCode().then(async (result: boolean) => {
      if (result) {
        navigationRef.current?.navigate(Routes.PassCode, {
          PINCodeStatus: PinStatus.enter,
          showBackButton: false,
        });
      } else {
        navigationRef.current?.navigate(Routes.PassCode, {
          PINCodeStatus: PinStatus.choose,
          showBackButton: false,
        });
      }
    });

    // const wallets = await getListWallet();
    // if (!wallets.length) {
    //   navigationRef.current?.navigate(Routes.GetStarted);
    // }

    // TODO: Hide splashscreen after all step have completed
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={init}>
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
          <Stack.Screen
            name={Routes.PassCode}
            component={PassCode}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name={Routes.Receive} component={Receive} />
          <Stack.Screen name={Routes.Send} component={Send} />
          <Stack.Screen name={Routes.Settings} component={Settings} />
          <Stack.Screen name={Routes.Security} component={Security} />
          <Stack.Screen name={Routes.TokensListed} component={TokensListed} />
          <Stack.Screen name={Routes.Transaction} component={Transaction} />
          <Stack.Screen name={Routes.Token} component={Token} />
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
