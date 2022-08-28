import Routes from '@Navigators/Routes';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Distribution } from '@Screens/Distribution/Distribution';
import { Pay } from '@Screens/Pay';
import Wallet from '@Screens/Wallet';
import { COLORS } from '@Theme/colors';
import React from 'react';
import IconFeather from 'react-native-vector-icons/Feather';

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
