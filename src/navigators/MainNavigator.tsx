import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/AntDesign';

import Cash from '../screens/Cash';
import DEX from '../screens/DEX';
import Wallet from '../screens/Wallet';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="wallet" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="DEX"
        component={DEX}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="retweet" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Cash"
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

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
