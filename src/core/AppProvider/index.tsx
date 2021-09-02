import React from 'react';

import { AppProvider } from './AppProvider';
import { MarketProvider } from './MarketProvider';
import { RemoteConfigProvider } from './RemoteConfigProvider';
import { TokenProvider } from './TokenProvider';

export const Root: React.FC = (props) => {
  return (
    <RemoteConfigProvider>
      <AppProvider>
        <TokenProvider>
          <MarketProvider>{props.children}</MarketProvider>
        </TokenProvider>
      </AppProvider>
    </RemoteConfigProvider>
  );
};
