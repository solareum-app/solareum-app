import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Header as HeaderElement } from 'react-native-elements';

import { COLORS, FONT_SIZES } from '../../theme';

const s = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white0,
    paddingVertical: 4,
    fontWeight: 'bold',
  },
});

const HeaderTitle = () => {
  return <Text style={s.title}>Receive Tokens</Text>;
};

export const Header: React.FC = () => {
  return (
    <HeaderElement
      centerComponent={<HeaderTitle />}
      containerStyle={{
        backgroundColor: COLORS.dark2,
        borderBottomColor: COLORS.dark4,
      }}
    />
  );
};

export default Header;
