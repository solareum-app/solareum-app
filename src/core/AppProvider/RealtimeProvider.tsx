import React, { useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

import { parseTokenAccountData } from '../../spl-utils/tokens/data';
import { TOKEN_PROGRAM_ID } from '../../spl-utils/tokens/instructions';

import { useToken } from './TokenProvider';
import { useConnection } from './ConnectionProvider';

export const RealtimeProvider: React.FC = (props) => {
  const { accountList, setAccountByPk } = useToken();
  const connection = useConnection();

  const activeAccountList = accountList.filter((i) => i.publicKey);

  useEffect(() => {
    const xsbAccount = activeAccountList.find((i) => i.symbol === 'XSB');
    if (!xsbAccount) {
      return;
    }

    const pk = xsbAccount?.publicKey;
    const onChange = (accountInfo) => {
      let { amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
        ? parseTokenAccountData(accountInfo.data)
        : {};
      const account = accountList.find((i) => i.publicKey === pk);
      const newAccount = {
        ...account,
        amount,
      };
      setAccountByPk(pk, newAccount);
    };

    connection.onAccountChange(new PublicKey(xsbAccount?.publicKey), onChange);
  }, [accountList, connection]);

  return props.children;
};
