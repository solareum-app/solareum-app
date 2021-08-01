import React from 'react';
import { Icon as AntDesignIcon, IconProps } from 'react-native-elements';

const Icon: React.FC<IconProps> = ({
  type = 'antdesign',
  size = 20,
  ...props
}) => {
  return <AntDesignIcon type={type} size={size} {...props} />;
};

export default Icon;
