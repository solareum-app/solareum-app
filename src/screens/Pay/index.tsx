import { grid } from '@Components/Styles';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import { EventMessage } from '@Screens/EventMessage/EventMessage';
import { Header } from '@Screens/Pay/Header';
import { Receive } from '@Screens/Pay/Receive';
import { TransferAction } from '@Screens/Wallet';
import { COLORS } from '@Theme/index';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

const s = StyleSheet.create({
  main: {
    flex: 1,
  },
  receive: {
    marginBottom: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.dark0,
  },
  notificationWrp: {
    position: 'relative',
    zIndex: 9999,
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
      <View style={s.notificationWrp}>
        <EventMessage top={-24} />
      </View>
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
