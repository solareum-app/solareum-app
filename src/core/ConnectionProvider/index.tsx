import React, { useContext } from 'react';

import { MAINNET_URL } from '../../config';

type ConnectionContextType = {
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
  connection: null;
};
const ConnectionContext = React.createContext<ConnectionContextType | null>(
  null,
);

export const ConnectionProvider: React.FC = ({ children }) => {
  const [endpoint, setEndpoint] = React.useState(MAINNET_URL);
  const connectionContextValue = {
    endpoint,
    setEndpoint,
    connection: null,
  };

  return (
    <ConnectionContext.Provider value={connectionContextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  let context = useContext(ConnectionContext);

  if (!context) {
    throw new Error('[ConnectionProvider] Missing connection context');
  }

  return context.connection;
}

export function useConnectionConfig() {
  let context = useContext(ConnectionContext);

  if (!context) {
    throw new Error('[ConnectionProvider] Missing connection context');
  }

  return { endpoint: context.endpoint, setEndpoint: context.setEndpoint };
}

export function useIsProdNetwork() {
  let context = useContext(ConnectionContext);

  if (!context) {
    throw new Error('[ConnectionProvider] Missing connection context');
  }

  return context.endpoint === MAINNET_URL;
}
