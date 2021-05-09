import { StyleSheet } from 'react-native';

import { COLORS } from '../../theme/colors';

export const grid = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
  header: {
    flex: 0,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.dark0,
    padding: 20,
    minHeight: 400,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: COLORS.white2,
    lineHeight: 28,
  }
});

export const typo = StyleSheet.create({
  normal: {
    color: COLORS.white2,
    fontSize: 18,
    lineHeight: 28,
  }
});
