import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconFeather from 'react-native-vector-icons/Feather';

import Market from '../screens/Market';
import Social from '../screens/Social';
import Wallet from '../screens/Wallet';
import { COLORS } from '../theme/colors';
import Routes from './Routes';

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
        name={Routes.Market}
        component={Market}
        options={{
          tabBarIcon: ({ color }) => {
            return <IconFeather name="repeat" color={color} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.Social}
        component={Social}
        options={{
          tabBarIcon: ({ color }) => {
            return <IconFeather name="coffee" color={color} size={20} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};
