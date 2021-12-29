import React from 'react';

import { AppProvider } from './AppProvider';
import { MarketProvider } from './MarketProvider';
import { RemoteConfigProvider } from './RemoteConfigProvider';
import { TokenProvider } from './TokenProvider';
import { LocalizeProvider } from './LocalizeProvider';
import { PriceProvider } from './PriceProvider';

export const Root: React.FC = (props) => {
  return (
    <RemoteConfigProvider>
      <LocalizeProvider>
        <AppProvider>
          <TokenProvider>
            <PriceProvider>
              <MarketProvider>{props.children}</MarketProvider>
            </PriceProvider>
          </TokenProvider>
        </AppProvider>
      </LocalizeProvider>
    </RemoteConfigProvider>
  );
};
