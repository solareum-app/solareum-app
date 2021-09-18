import { StyleSheet } from 'react-native';

import { grid } from '../../components/Styles';

export const style = StyleSheet.create({
  main: {
    padding: 20,
    ...grid.popover,
  },
  footer: {},
  button: {
    marginTop: 8,
  },
});
