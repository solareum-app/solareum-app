import { Connection } from '@solana/web3.js';
import React, { useContext, useMemo } from 'react';
import { MAINNET_URL } from '../../config';

const ConnectionContext = React.createContext<{
  connection: Connection;
  endpoint: string;
  setEndpoint: (string: string) => void;
} | null>(null);

export const useConnection = (): Connection => {
  let context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('Missing connection context');
  }
  return context.connection;
};

export const ConnectionProvider = ({ children }) => {
  const endpoint = MAINNET_URL;
  const setEndpoint = () => null;

  const connection = useMemo(
    () => new Connection(endpoint, 'recent'),
    [endpoint],
  );

  return (
    <ConnectionContext.Provider value={{ endpoint, setEndpoint, connection }}>
      {children}
    </ConnectionContext.Provider>
  );
};
