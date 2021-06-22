import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';

import DEX from '../screens/DEX';
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
            return <Icon name="wallet" color={color} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.DEX}
        component={DEX}
        options={{
          tabBarIcon: ({ color }) => {
            return <Icon name="retweet" color={color} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name={Routes.Social}
        component={Social}
        options={{
          tabBarIcon: ({ color }) => {
            return <Icon name="aliwangwang-o1" color={color} size={20} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};
