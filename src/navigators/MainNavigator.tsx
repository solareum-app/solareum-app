import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import { View, StyleSheet, Linking } from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

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
import { TransferAction } from '../screens/Wallet';
import { usePrice } from '../core/AppProvider/PriceProvider';
import { useToken } from '../core/AppProvider/TokenProvider';
import { ExploreItem } from '../screens/ExploreItem/ExploreItem';
import { Explore } from '../screens/Explore/Explore';
import { MoonPay } from '../screens/Moonpay/Moonpay';

const s = StyleSheet.create({
  backWrp: {
    marginLeft: 20,
  },
});

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const navigationRef = useRef(null);
  const { ready } = useToken();
  const { accountList } = usePrice();

  const checkInitScreen = async () => {
    const wallets = await getListWallet();

    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }

    SplashScreen.hide();
  };

  const handleDynamicLink = (link: any) => {
    if (!link) {
      return;
    }

    const url = new URL(link.url);
    // TODO: default token is XSB
    // Going to support USDC + SOL anytime soon
    const token = url.searchParams.get('token') || 'XSB';
    const address = url.searchParams.get('address');
    const account = accountList.find((i) => i.symbol === token);

    if (!account) {
      return;
    }

    if (navigationRef.current.getCurrentRoute().name === Routes.Token) {
      navigationRef.current.setParams({
        action: TransferAction.send,
        token: account,
        initAddress: address,
      });
    } else {
      navigationRef.current?.navigate(Routes.Token, {
        action: TransferAction.send,
        token: account,
        initAddress: address,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [ready]);

  useEffect(() => {
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    Linking.getInitialURL().then(handleDynamicLink);
  }, [ready]);

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
          <Stack.Screen name={Routes.ExploreList} component={Explore} />
          <Stack.Screen name={Routes.ExploreItem} component={ExploreItem} />
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
          <Stack.Screen name={Routes.MoonPay} component={MoonPay} />
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
