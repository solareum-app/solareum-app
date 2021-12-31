import React, { useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

import { parseTokenAccountData } from '../../spl-utils/tokens/data';
import { TOKEN_PROGRAM_ID } from '../../spl-utils/tokens/instructions';

import { useToken } from './TokenProvider';
import { useConnection } from './ConnectionProvider';

export const RealtimeProvider: React.FC = (props) => {
  const { setAccountByPk, accountList } = useToken();
  const connection = useConnection();

  const onChange = (pk, accountInfo) => {
    let { amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
      ? parseTokenAccountData(accountInfo.data)
      : {};

    if (!amount) {
      return;
    }

    const account = accountList.find((i) => i.publicKey === pk);
    const newAccount = {
      ...account,
      amount,
    };

    setAccountByPk(pk, newAccount);
  };

  useEffect(() => {
    const activeAccountList = accountList.filter((i) => i.publicKey);
    const subscribers: number[] = [];
    if (!activeAccountList) {
      return;
    }

    for (let i = 0; i < activeAccountList.length; i++) {
      const item = activeAccountList[i];
      const pk = item?.publicKey;

      const id = connection.onAccountChange(
        new PublicKey(pk),
        onChange.bind(null, pk),
      );
      subscribers.push(id);
    }

    return () => {
      subscribers.forEach((i) => {
        connection.removeAccountChangeListener(i);
      });
    };
  }, [accountList, connection]);

  return props.children;
};
