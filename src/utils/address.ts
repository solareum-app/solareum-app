import Clipboard from '@react-native-community/clipboard';
import { DeviceEventEmitter } from 'react-native';
import { MESSAGE_TYPE } from '../screens/EventMessage/EventMessage';

export const getShortHash = (hash: string) => {
  if (hash.length <= 12) {
    return hash;
  }
  return `${hash.slice(0, 6)}...${hash.slice(hash.length - 6)}`;
};

export const copyToClipboard = (value: string) => {
  Clipboard.setString(value);
  DeviceEventEmitter.emit(MESSAGE_TYPE.copy, value);
};
