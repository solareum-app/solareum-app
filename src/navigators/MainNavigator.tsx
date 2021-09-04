import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import { View, StyleSheet, AppState, Alert } from 'react-native';
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
import ManageTokenList from '../screens/ManageTokenList';
import DailyMission from '../screens/Settings/DailyMission';
import Influencer from '../screens/Settings/Influencer';
import Airdrop from '../screens/Settings/Airdrop';
import LockScreen from '../screens/LockScreen';
import BiometricPopup from '../screens/BiometricPopup';
import ChangePinLock from '../screens/ChangePinLock';
import { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import BackgroundTimer from 'react-native-background-timer';

let timeoutId: any;
const s = StyleSheet.create({
  backWrp: {
    marginLeft: 20,
  },
});

const Stack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const [lockedType, setLockedType] = useState('finger');
  const [showPinLock, setShowPinLock] = useState(true);
  const [showFingerLock, setShowFingerLock] = useState(true);
  const [showPinCodeStatus, setShowPinCodeStatus] = useState('');

  const navigationRef = useRef(null);

  const checkInitScreen = async () => {
    const wallets = await getListWallet();

    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }

    SplashScreen.hide();
  };

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    getHasPinState();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;

      console.log('AppState', appState.current);
      if (appState.current === 'background') {
        timeoutId = BackgroundTimer.setTimeout(() => {
          console.log('locked');
          setLockedType('pin');
          setShowPinLock(true);
        }, 2 * 60 * 1000);
      }
    });

    return () => {
      subscription?.remove();
      BackgroundTimer.clearTimeout(timeoutId);
    };
  }, []);

  const getHasPinState = async () => {
    const hasPin = await hasUserSetPinCode();
    if (hasPin) {
      setShowPinCodeStatus('enter');
    } else {
      setShowPinCodeStatus('choose');
    }
  };

  const finishProcess = async () => {
    if (showPinCodeStatus === 'choose') {
      Alert.alert(null, 'You have successfully set your pin.', [
        {
          title: 'Ok',
          onPress: () => {
            getHasPinState();
          },
        },
      ]);
    }

    if (showPinCodeStatus === 'enter') {
      Alert.alert(null, 'You have successfully entered your pin.', [
        {
          title: 'Ok',
          onPress: () => {
            setShowPinLock(false);
            getHasPinState();
            setLockedType('');
          },
        },
      ]);
    }
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
        {lockedType === '' && (
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
            <Stack.Screen name={Routes.Airdrop} component={Airdrop} />
            <Stack.Screen
              name={Routes.ManagementTokenList}
              component={ManageTokenList}
            />

            <Stack.Screen
              name={Routes.ChangePinLock}
              component={ChangePinLock}
            />
          </Stack.Navigator>
        )}

        {showPinLock === true && lockedType === 'pin' && (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name={Routes.Home}>
              {() => (
                <LockScreen
                  showPinCodeStatus={showPinCodeStatus}
                  finishProcess={finishProcess}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
        {showFingerLock === true && lockedType === 'finger' && (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name={Routes.Home}>
              {() => (
                <BiometricPopup
                  setShowFingerLock={setShowFingerLock}
                  setLockedType={setLockedType}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </Host>
    </NavigationContainer>
  );
};

export default MainNavigator;
