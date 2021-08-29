import { StyleSheet } from 'react-native';

import { COLORS } from '../../theme/colors';

export const grid = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
    position: 'relative',
  },
  header: {
    flex: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  wrp: {
    flex: 1,
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
  },
  button: {
    height: 44,
  },
  buttonCritical: {
    borderColor: COLORS.critical,
  },
  buttonCriticalTitle: {
    color: COLORS.critical,
  },
});

export const input = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  label: {
    fontWeight: 'normal',
  },
});

export const typo = StyleSheet.create({
  title: {
    color: COLORS.white2,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  normal: {
    color: COLORS.white2,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  helper: {
    color: COLORS.white4,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  warning: {
    color: COLORS.warning,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  caution: {
    color: COLORS.caution,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  critical: {
    color: COLORS.critical,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
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
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 20,
    marginRight: 20,
  },
});
