import React, { useCallback, useRef } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import { View, StyleSheet, Linking, Platform } from 'react-native';

import CreateWallet from '../screens/WalletManagement/CreateWallet';
import EditWallet from '../screens/WalletManagement/EditWallet';
import GetStarted from '../screens/GetStarted';
import ImportWallet from '../screens/ImportWallet';
import Notifications from '../screens/Notifications';
import Settings from '../screens/Settings';
import { Wallet as SettingWallet } from '../screens/Settings/Wallet';
import Search from '../screens/Search';
import Token from '../screens/Token';
import DEX from '../screens/DEX';
import Swap from '../screens/DEX/Swap';
import { getListWallet } from '../storage/WalletCollection';
import SplashScreen from 'react-native-splash-screen';
import { HomeScreen } from './HomeScreen';
import { COLORS } from '../theme/colors';
import Routes from './Routes';
import { Icon } from 'react-native-elements';
import ManageTokenList from '../screens/ManageTokenList';
import DailyMission from '../screens/Settings/DailyMission';
import Influencer from '../screens/Settings/Influencer';
import Airdrop from '../screens/Settings/Airdrop';
import SwapApp from '../screens/Settings/SwapApp';
import { config } from '../deeplink/config';
import { TransferAction } from '../screens/Wallet';
import { usePrice } from '../core/AppProvider/PriceProvider';

const s = StyleSheet.create({
  backWrp: {
    marginLeft: 20,
  },
});

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const navigationRef = useRef(null);
  const { accountList } = usePrice();

  const checkInitScreen = async () => {
    const wallets = await getListWallet();

    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }

    SplashScreen.hide();
  };

  const linking: LinkingOptions = {
    prefixes: ['solareum://rewards', 'https://solareum.page.link'],

    async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (url === null) {
        return;
      }
      handleURL(url);
      return url;
    },

    subscribe(listener) {
      const onReceiveURL = ({ url }: { url: string }) => {
        if (url == null) {
          console.log('linking url null');
        }
          handleURL(url);
        listener(url);
      };

      if (Platform.OS === 'android') {
        Linking.getInitialURL()
          .then((url) => {
            handleURL(url);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      Linking.addEventListener('url', onReceiveURL);
      return () => {
        Linking.removeEventListener('url', onReceiveURL);
      };
    },
    config,
  };

  const handleURL = useCallback(
    (url: string) => {
      const link = new URL(url);
      // TODO: default token is XSB
      // Going to support USDC + SOL anytime soon
      const token = link.searchParams.get('token') || 'XSB';
      const address = link.searchParams.get('address');
      const account = accountList.find((i) => i.symbol === token);

      if (account !== null) {
        const currentRoute = navigationRef.current.getCurrentRoute();
        if (currentRoute.name == Routes.Token){
          navigationRef.current.setParams({token: account,id: address});
        }else{
          navigationRef.current?.navigate(Routes.Token, {
            token: account,
            action: TransferAction.send,
            id: address,
          });
        }
      } else {
        navigationRef.current?.navigate(Routes.GetStarted);
      }
    },
    [accountList],
  );


  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={checkInitScreen}
      linking={linking}
    >
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
            headerLeft: ({ canGoBack, onPress }: any) =>
              canGoBack && (
                <View style={s.backWrp}>
                  <Icon
                    type="feather"
                    name="arrow-left"
                    color={COLORS.white4}
                    size={20}
                    onPress={onPress}
                  />
                </View>
              ),
          }}
        >
          <Stack.Screen
            name={Routes.Home}
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Routes.DEX}
            component={DEX}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Routes.Swap}
            component={Swap}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={Routes.GetStarted} component={GetStarted} />
          <Stack.Screen name={Routes.CreateWallet} component={CreateWallet} />
          <Stack.Screen name={Routes.EditWallet} component={EditWallet} />
          <Stack.Screen name={Routes.ImportWallet} component={ImportWallet} />
          <Stack.Screen name={Routes.Notifications} component={Notifications} />
          <Stack.Screen name={Routes.Settings} component={Settings} />
          <Stack.Screen name={Routes.Token} component={Token} />
          <Stack.Screen name={Routes.SettingWallet} component={SettingWallet} />
          <Stack.Screen name={Routes.Search} component={Search} />
          <Stack.Screen name={Routes.Mission} component={DailyMission} />
          <Stack.Screen name={Routes.Influencer} component={Influencer} />
          <Stack.Screen name={Routes.Airdrop} component={Airdrop} />
          <Stack.Screen
            name={Routes.ManagementTokenList}
            component={ManageTokenList}
          />
          <Stack.Screen name={Routes.SwapApplication} component={SwapApp} />
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
