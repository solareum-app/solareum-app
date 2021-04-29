import React from 'react';

import BaseButton, { BaseButtonProps } from './BaseButton';

const CopyAddressButton: React.FC<BaseButtonProps> = () => {
  const onPressHandler = React.useCallback(() => {
    console.log('onPressHandler');
  }, []);

  return (
    <>
      <BaseButton text="Copy" iconName="copy1" onPress={onPressHandler} />
    </>
  );
};

export default CopyAddressButton;
