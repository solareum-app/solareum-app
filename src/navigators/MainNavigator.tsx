import React, { useEffect, useRef } from 'react';
import { LinkingOptions, NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { View, StyleSheet, Linking, Alert, Platform} from 'react-native';
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
import {config} from '../deeplink/config';
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
  const testAccount = accountList.find((i) => i.mint === 'SOL');


  const checkInitScreen = async () => {
    const wallets = await getListWallet();

    if (!wallets.length) {
      navigationRef.current?.navigate(Routes.GetStarted);
    }

    SplashScreen.hide();
  };

  
  const linking : LinkingOptions= {
    prefixes: ['https://solareum.page.link','solareum://rewards'],
    async getInitialURL() {
      const url = await  Linking.getInitialURL();
      console.log("getInitialURL");
        if (url === null){
          console.log("linking url null");
          return;
        }
        console.log("linking url:",url);
       
          handleURL(url);
       
         return url;
     
    },
  
  
    subscribe(listener) {
      console.log("linking url active");
      const onReceiveURL = ({ url }: { url: string }) =>{
        console.log("onReceiveURL");
        if (url == null){
          console.log("linking url listner null");
        }
        console.log("linking url listner: ",url);
        if (url.includes("token")){
          handleURL(url);
        }
        listener(url);
      } 
  if (Platform.OS === "ios"){
    Linking.addEventListener('url', onReceiveURL);

  }else {
    console.log("android");
      Linking.getInitialURL().then(url => {
        handleURL(url);
      }).catch(error =>{
        console.log(error)
      });
  }
      return () => {
        Linking.removeEventListener('url', onReceiveURL);
      }
    },
    config,
    };
  

 function  handleURL(url){
  console.log("handleURL");
      var link = new URL(url);
          var token = link.searchParams.get("token");
          console.log(token);
        let action = TransferAction.send;
        navigationRef.current?.navigate(Routes.Token, {testAccount, action, id:token});
        }
    

  return (
    <NavigationContainer ref={navigationRef} onReady={checkInitScreen} linking = {linking} >
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
          <Stack.Screen name={Routes.Settings}component={Settings} />
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
