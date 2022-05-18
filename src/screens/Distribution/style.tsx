import { StyleSheet } from 'react-native';

import { COLORS } from '../../theme';
import { typo } from '../../components/Styles';

export const box = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.dark0,
    borderColor: COLORS.dark2,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 0,
  },
  badge: {
    backgroundColor: '#2155CD',
    borderRadius: 16,
    padding: 4,
    paddingHorizontal: 16,
  },
  badgeOutline: {
    borderColor: '#2155CD',
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
    paddingHorizontal: 16,
  },
  title: {
    ...typo.titleLeft,
    marginBottom: 0,
    fontSize: 18,
  },
  helper: {
    ...typo.helper,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 12,
  },
  value: {
    ...typo.normal,
    marginBottom: 0,
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 60,
    textAlign: 'center',
  },
});
