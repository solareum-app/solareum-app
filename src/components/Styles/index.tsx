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
    minHeight: 400,
    padding: 20,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: COLORS.white2,
    lineHeight: 28,
  }
});

export const typo = StyleSheet.create({
  title: {
    color: COLORS.white2,
    fontSize: 22,
    lineHeight: 32,
    marginBottom: 12,
    textAlign: 'center'
  },
  normal: {
    color: COLORS.white2,
    fontSize: 18,
    lineHeight: 28,
  },
  bold: {
    fontWeight: 'bold',
  },
  helper: {
    color: COLORS.white4,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    color: COLORS.white2,
  },
  address: {
    color: COLORS.white2,
    backgroundColor: COLORS.dark2,
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 16,
    lineHeight: 18,
    marginLeft: 20,
    marginRight: 20,
  },
});
