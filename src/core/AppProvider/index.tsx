import React from 'react';

import { AppProvider } from './AppProvider';
import { MarketProvider } from './MarketProvider';
import { RemoteConfigProvider } from './RemoteConfigProvider';
import { TokenProvider } from './TokenProvider';
import { LocalizeProvider } from './LocalizeProvider';
import { RealtimeProvider } from './RealtimeProvider';
import { ConnectionProvider } from './ConnectionProvider';

export const Root: React.FC = (props) => {
  return (
    <RemoteConfigProvider>
      <LocalizeProvider>
        <ConnectionProvider>
          <AppProvider>
            <TokenProvider>
              <MarketProvider>
                <RealtimeProvider>{props.children}</RealtimeProvider>
              </MarketProvider>
            </TokenProvider>
          </AppProvider>
        </ConnectionProvider>
      </LocalizeProvider>
    </RemoteConfigProvider>
  );
};
