import React from 'react';

import { View, ScrollView, SafeAreaView } from 'react-native';

import { grid } from '../../../components/Styles';
import { Airdrop as AirdropComp } from '../../Airdrop/Airdrop';

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
