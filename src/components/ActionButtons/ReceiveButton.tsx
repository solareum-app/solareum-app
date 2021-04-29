import React from 'react';

import BaseButton, { BaseButtonProps } from './BaseButton';

const SendButton: React.FC<BaseButtonProps> = (props) => {
  return <BaseButton {...props} text="Send" iconName="download" />;
};

export default SendButton;
