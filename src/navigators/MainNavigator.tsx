import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/AntDesign';

import Cash from '../screens/Cash';
import DEX from '../screens/DEX';
import Notifications from '../screens/Notifications';
import Receive from '../screens/Receive';
import Send from '../screens/Send';
import Settings from '../screens/Settings';
import TokensListed from '../screens/TokensListed';
import Transaction from '../screens/Transaction';
import Transfers from '../screens/Transfers';
import Wallet from '../screens/Wallet';
import Routes from './Routes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={Routes.Wallet}
        component={Wallet}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="wallet" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.DEX}
        component={DEX}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="swap" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.Cash}
        component={Cash}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="rocket1" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name=" "
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={Routes.Notifications} component={Notifications} />
        <Stack.Screen name={Routes.Receive} component={Receive} />
        <Stack.Screen name={Routes.Send} component={Send} />
        <Stack.Screen name={Routes.Settings} component={Settings} />
        <Stack.Screen name={Routes.TokensListed} component={TokensListed} />
        <Stack.Screen name={Routes.Transaction} component={Transaction} />
        <Stack.Screen name={Routes.Transfers} component={Transfers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
