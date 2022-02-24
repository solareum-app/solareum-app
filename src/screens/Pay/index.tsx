import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { grid } from '../../components/Styles';
import Routes from '../../navigators/Routes';
import { COLORS } from '../../theme';
import { TransferAction } from '../Wallet';
import { Header } from './Header';
import { Receive } from './Receive';

const s = StyleSheet.create({
  main: {
    flex: 1,
  },
  receive: {
    marginBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.dark0,
  },
});

export const Pay = () => {
  const navigation = useNavigation();

  const gotoSearch = () => {
    navigation.navigate(Routes.Search, {
      action: TransferAction.send,
    });
  };

  return (
    <View style={s.main}>
      <Header />
      <SafeAreaView style={grid.container}>
        <ScrollView>
          <View style={s.receive}>
            <Receive />
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={s.footer}>
        <Button title="Send" onPress={gotoSearch} />
      </View>
    </View>
  );
};
