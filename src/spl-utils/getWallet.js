import { Connection } from '@solana/web3.js';

import { getAccountFromSeed, mnemonicToSeed } from './wallet-account';
import { Wallet } from './wallet';
import { TOKEN_PROGRAM_ID } from './tokens/instructions';
import { parseMintData, parseTokenAccountData } from './tokens/data';
import { MAINNET_URL } from '../config';

export const getConnection = () => {
  try {
    const connection = new Connection(MAINNET_URL);
    return connection;
  } catch (err) {
    return null;
  }
};

export const getWallet = async (recovery, name) => {
  const seed = await mnemonicToSeed(recovery);
  const seedBuffer = Buffer.from(seed, 'hex');
  const account = getAccountFromSeed(seedBuffer, 0);
  const connection = getConnection();
  const wallet = new Wallet(connection, 'solareum', { account, name });

  return wallet;
};

export const getBalanceInfo = async (publicKey) => {
  const connection = getConnection();
  const accountInfo = await connection.getAccountInfo(publicKey);
  let { mint, owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {};
  const mintInfo = mint ? await connection.getAccountInfo(mint) : null;

  if (mint) {
    try {
      let { decimals } = parseMintData(mintInfo.data);
      return {
        amount,
        decimals,
        mint: mint.toBase58(),
        owner: owner.toBase58(),
        valid: true,
      };
    } catch (e) {
      return {
        amount,
        decimals: 0,
        mint,
        owner,
        valid: false,
      };
    }
  }

  // SOL native token
  if (!mint) {
    return {
      mint: 'SOL',
      amount: accountInfo?.lamports ?? 0,
      owner: publicKey.toBase58(),
      decimals: 9,
      valid: true,
    };
  }

  return null;
};

export const getAccountList = async (wallet) => {
  try {
    const tokenAccountInfo = (await wallet.getTokenAccountInfo()) || [];
    const publicKeys = [
      wallet.publicKey,
      ...tokenAccountInfo.map(({ publicKey }) => publicKey),
    ];

    const balanceList = [];

    for (let i = 0; i < publicKeys.length; i++) {
      const pk = publicKeys[i];
      const balance = await getBalanceInfo(pk);
      balanceList.push({
        ...balance,
        publicKey: pk.toBase58(),
      });
    }

    return balanceList;
  } catch (err) {
    return [];
  }
};
