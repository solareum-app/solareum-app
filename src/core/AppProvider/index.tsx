import React from 'react';

import { AppProvider } from './AppProvider';
import { MarketProvider } from './MarketProvider';
import { RemoteConfigProvider } from './RemoteConfigProvider';
import { TokenProvider } from './TokenProvider';
import { LocalizeProvider } from './LocalizeProvider';
import { RealtimeProvider } from './RealtimeProvider';
import { ConnectionProvider } from './ConnectionProvider';
import { PriceProvider } from './PriceProvider';

export const Root: React.FC = (props) => {
  return (
    <RemoteConfigProvider>
      <ConnectionProvider>
        <LocalizeProvider>
          <AppProvider>
            <TokenProvider>
              <RealtimeProvider>
                <MarketProvider>
                  <PriceProvider>{props.children}</PriceProvider>
                </MarketProvider>
              </RealtimeProvider>
            </TokenProvider>
          </AppProvider>
        </LocalizeProvider>
      </ConnectionProvider>
    </RemoteConfigProvider>
  );
};
