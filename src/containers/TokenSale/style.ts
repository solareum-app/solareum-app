import { StyleSheet } from 'react-native';

import { grid } from '../../components/Styles';

export const style = StyleSheet.create({
  main: {
    padding: 20,
    ...grid.popover,
  },
  body: {
    marginBottom: 20,
  },
  footer: {},
  button: {
    marginTop: 8,
  },
});
