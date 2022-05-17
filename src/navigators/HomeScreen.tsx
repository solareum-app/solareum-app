import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconFeather from 'react-native-vector-icons/Feather';

import Wallet from '../screens/Wallet';
import { Pay } from '../screens/Pay';
import { COLORS } from '../theme/colors';
import Routes from './Routes';
import { Distribution } from '../screens/Distribution/Distribution';

const Tab = createBottomTabNavigator();

export const HomeScreen: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: COLORS.dark2,
      }}
      tabBarOptions={{
        style: {
          backgroundColor: COLORS.dark0,
          borderTopColor: COLORS.dark4,
        },
        activeTintColor: COLORS.blue0,
      }}
    >
      <Tab.Screen
        name={Routes.Wallet}
        component={Wallet}
        options={{
          tabBarIcon: ({ color }) => {
            return <IconFeather name="shield" color={color} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.Pay}
        component={Pay}
        options={{
          tabBarIcon: ({ color }) => {
            return <IconFeather name="hexagon" color={color} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.Distribution}
        component={Distribution}
        options={{
          tabBarIcon: ({ color }) => {
            return <IconFeather name="triangle" color={color} size={20} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};
