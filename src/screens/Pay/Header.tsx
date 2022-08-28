import { COLORS, FONT_SIZES } from '@Theme/index';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Header as HeaderElement } from 'react-native-elements';

const s = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white0,
    paddingVertical: 4,
    fontWeight: 'bold',
  },
});

const HeaderTitle = () => {
  return <Text style={s.title}>Pay</Text>;
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
