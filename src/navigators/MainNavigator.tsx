import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import { View, StyleSheet } from 'react-native';
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
import { getListWallet } from '../storage/WalletCollection';
import SplashScreen from 'react-native-splash-screen';
import { HomeScreen } from './HomeScreen';
import { COLORS } from '../theme/colors';
import Routes from './Routes';
import { Icon } from 'react-native-elements';
import DailyMission from '../screens/DailyMission';
import ManageTokenList from '../screens/ManageTokenList';

const s = StyleSheet.create({
  backWrp: {
    marginLeft: 20,
  },
});

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const navigationRef = useRef(null);

  const checkInitScreen = async () => {
    const wallets = await getListWallet();

    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }

    SplashScreen.hide();
  };

  // TODO: rework on this then, This is not so stable
  // const handleAppStateChange = (nextAppState: any) => {
  //   if (nextAppState === 'background' || nextAppState === 'inactive') {
  //     SplashScreen.show();
  //   }
  //   if (nextAppState === 'active') {
  //     SplashScreen.hide();
  //   }
  // };
  // useEffect(() => {
  //   AppState.addEventListener('change', handleAppStateChange);
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

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
          <Stack.Screen name={Routes.ManagementTokenList} component={ManageTokenList} />
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
