import { grid } from '@Components/Styles';
import { StyleSheet } from 'react-native';

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
