import React from 'react';

import { AppProvider } from './AppProvider';
import { MarketProvider } from './MarketProvider';
import { RemoteConfigProvider } from './RemoteConfigProvider';
import { TokenProvider } from './TokenProvider';
import { LocalizeProvider } from './LocalizeProvider';

export const Root: React.FC = (props) => {
  return (
    <RemoteConfigProvider>
      <LocalizeProvider>
        <AppProvider>
          <TokenProvider>
            <MarketProvider>{props.children}</MarketProvider>
          </TokenProvider>
        </AppProvider>
      </LocalizeProvider>
    </RemoteConfigProvider>
  );
};
