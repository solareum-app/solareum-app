import { StyleSheet } from 'react-native';

import { COLORS } from '../../theme/colors';

export const typo = StyleSheet.create({
  title: {
    color: COLORS.white2,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleLeft: {
    color: COLORS.white2,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontWeight: 'bold',
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
  popover: {
    paddingBottom: 40,
  },
  group: {
    marginBottom: 12,
  },
  groupTitle: {
    ...typo.helper,
    marginBottom: 8,
    color: COLORS.white4,
  },
  groupValue: {
    ...typo.normal,
    lineHeight: 20,
    fontSize: 18,
  },
});

export const row = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 0,
  },
  label: {
    ...typo.normal,
    marginBottom: 0,
    lineHeight: 20,
  },
  value: {
    lineHeight: 40,
    fontSize: 20,
    color: COLORS.white2,
  },
  value2: {
    fontSize: 16,
    color: COLORS.blue2,
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
