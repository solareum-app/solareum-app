import { usePrice } from '@Core/AppProvider/PriceProvider';
import { RewardsProvider } from '@Core/AppProvider/RewardsProvider';
import { useToken } from '@Core/AppProvider/TokenProvider';
import { HomeScreen } from '@Navigators/HomeScreen';
import Routes from '@Navigators/Routes';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DEX from '@Screens/DEX';
import Swap from '@Screens/DEX/Swap';
import { Explore } from '@Screens/Explore/Explore';
import { ExploreItem } from '@Screens/ExploreItem/ExploreItem';
import GetStarted from '@Screens/GetStarted';
import ImportWallet from '@Screens/ImportWallet';
import ManageTokenList from '@Screens/ManageTokenList';
import { MoonPay } from '@Screens/Moonpay/Moonpay';
import Notifications from '@Screens/Notifications';
import { Restore } from '@Screens/Restore/Restore';
import Search from '@Screens/Search';
import Settings from '@Screens/Settings';
import Airdrop from '@Screens/Settings/Airdrop';
import DailyMission from '@Screens/Settings/DailyMission';
import Influencer from '@Screens/Settings/Influencer';
import SwapApp from '@Screens/Settings/SwapApp';
import { Wallet as SettingWallet } from '@Screens/Settings/Wallet';
import Token from '@Screens/Token';
import { TransferAction } from '@Screens/Wallet';
import CreateWallet from '@Screens/WalletManagement/CreateWallet';
import EditWallet from '@Screens/WalletManagement/EditWallet';
import { getListWallet } from '@Storage/WalletCollection';
import { COLORS } from '@Theme/colors';
import React, { useCallback, useEffect, useRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Host } from 'react-native-portalize';
import SplashScreen from 'react-native-splash-screen';

const s = StyleSheet.create({
  backWrp: {
    marginLeft: 20,
  },
});

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const navigationRef = useRef<any>(null);
  const { ready } = useToken();
  const { accountList } = usePrice();

  const checkInitScreen = async () => {
    const wallets = await getListWallet();

    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }

    SplashScreen.hide();
  };

  const handleDynamicLink = useCallback(
    (link: any) => {
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

      if (navigationRef.current?.getCurrentRoute().name === Routes.Token) {
        navigationRef.current?.setParams({
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
    },
    [accountList],
  );

  const handleScheme = useCallback(
    (link: any) => {
      if (!link) {
        return;
      }

      const url = new URL(link.url);
      const urlRedirect = url.searchParams.get('scheme') || '';
      const token = url.searchParams.get('token') || 'XSB';
      const address = url.searchParams.get('address');
      const quantity = url.searchParams.get('quantity') || '';
      const client_id = url.searchParams.get('client_id');
      const e_usd = url.searchParams.get('e_usd') || '';

      if (!address) {
        return;
      }

      const account = accountList.find((i) => i.symbol === token);
      if (!account) {
        return;
      }
      if (navigationRef?.current.getCurrentRoute().name === Routes.Token) {
        navigationRef.current.setParams({
          action: TransferAction.send,
          initAddress: address,
          token: account,
          client_id: client_id,
          e_usd: e_usd,
          quantity: quantity,
          redirect: urlRedirect,
        });
      } else {
        navigationRef.current?.navigate(Routes.Token, {
          action: TransferAction.send,
          initAddress: address,
          token: account,
          client_id: client_id,
          e_usd: e_usd,
          quantity: quantity,
          redirect: urlRedirect,
        });
      }
    },
    [accountList],
  );

  useEffect(() => {
    if (!ready) return;
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    Linking.getInitialURL().then(handleDynamicLink);
    Linking.addEventListener('url', handleScheme);

    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [ready, accountList, handleDynamicLink, handleScheme]);

  useEffect(() => {
    if (!ready) return;
    dynamicLinks().getInitialLink().then(handleDynamicLink);
    Linking.getInitialURL().then(handleScheme);
  }, [handleDynamicLink, handleScheme, ready]);

  return (
    <NavigationContainer ref={navigationRef} onReady={checkInitScreen}>
      <Host>
        <RewardsProvider>
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
            <Stack.Screen
              name={Routes.GetStarted}
              component={GetStarted}
              options={{ headerShown: false }}
            />
            <Stack.Screen name={Routes.ExploreList} component={Explore} />
            <Stack.Screen name={Routes.ExploreItem} component={ExploreItem} />
            <Stack.Screen name={Routes.CreateWallet} component={CreateWallet} />
            <Stack.Screen name={Routes.EditWallet} component={EditWallet} />
            <Stack.Screen name={Routes.ImportWallet} component={ImportWallet} />
            <Stack.Screen
              name={Routes.Notifications}
              component={Notifications}
            />
            <Stack.Screen name={Routes.Settings} component={Settings} />
            <Stack.Screen name={Routes.Token} component={Token} />
            <Stack.Screen
              name={Routes.SettingWallet}
              component={SettingWallet}
            />
            <Stack.Screen name={Routes.Search} component={Search} />
            <Stack.Screen name={Routes.Mission} component={DailyMission} />
            <Stack.Screen name={Routes.Influencer} component={Influencer} />
            <Stack.Screen name={Routes.Restore} component={Restore} />
            <Stack.Screen name={Routes.Airdrop} component={Airdrop} />
            <Stack.Screen
              name={Routes.ManagementTokenList}
              component={ManageTokenList}
            />
            <Stack.Screen name={Routes.SwapApplication} component={SwapApp} />
            <Stack.Screen name={Routes.MoonPay} component={MoonPay} />
          </Stack.Navigator>
        </RewardsProvider>
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
