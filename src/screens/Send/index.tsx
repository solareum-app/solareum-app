import React from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';

type Props = {};
const Send: React.FC<Props> = () => {
  return (
    <View>
      <Input placeholder="Recipient Address" />
      <Input placeholder="BNB Amount" />
      <Button title="Next" />
    </View>
  );
};

export default Send;
