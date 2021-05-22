import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/AntDesign';

import DEX from '../screens/DEX';
import Fiat from '../screens/Fiat';
import Wallet from '../screens/Wallet';
import { COLORS } from '../theme/colors';
import Routes from './Routes';

const Tab = createBottomTabNavigator();

export const HomeScreen: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: COLORS.dark2 }}
      tabBarOptions={{
        style: { backgroundColor: COLORS.dark0, borderTopColor: COLORS.dark4 },
        activeTintColor: COLORS.blue2,
      }}>
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
        name={Routes.Fiat}
        component={Fiat}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="Safety" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};
