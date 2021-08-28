import React from 'react';
import { View, StyleSheet } from 'react-native';

import { RewardedAdButton } from '../../components/Admob/index';
import { grid } from '../../components/Styles';

const s = StyleSheet.create({});

type Props = {};
const GetStarted: React.FC<Props> = () => {
  return (
    <View style={grid.container}>
      <RewardedAdButton />
    </View>
  );
};

export default GetStarted;
