import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';

import { grid } from '../../components/Styles';
import { Header } from './Header';
import { Receive } from './Receive';

const s = StyleSheet.create({
  tokenMain: {
    marginBottom: 24,
  },
});

export const Pay = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <SafeAreaView style={grid.container}>
        <ScrollView>
          <Receive />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
