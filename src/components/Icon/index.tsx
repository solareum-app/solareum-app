import React from 'react';
import { Icon as AntDesignIcon, IconProps } from 'react-native-elements';

const Icon: React.FC<IconProps> = (props) => {
  return <AntDesignIcon type="antdesign" {...props} />;
};

export default Icon;
