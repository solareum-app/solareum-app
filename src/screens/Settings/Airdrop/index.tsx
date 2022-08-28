import { grid } from '@Components/Styles';
import { Airdrop as AirdropComp } from '@Screens/Airdrop/Airdrop';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

type Props = {};

const Airdrop: React.FC<Props> = () => {
  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <AirdropComp />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Airdrop;
