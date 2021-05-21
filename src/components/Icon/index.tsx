import React from 'react';
import { Icon as AntDesignIcon, IconProps } from 'react-native-elements';

const Icon: React.FC<IconProps> = (props) => {
  return <AntDesignIcon type="antdesign" size={20} {...props} />;
};

export default Icon;
