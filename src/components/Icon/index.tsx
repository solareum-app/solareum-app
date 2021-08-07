import React from 'react';
import { Icon as SvgIcon, IconProps } from 'react-native-elements';

const Icon: React.FC<IconProps> = ({
  type = 'antdesign',
  size = 20,
  ...props
}) => {
  return <SvgIcon type={type} size={size} {...props} />;
};

export default Icon;
