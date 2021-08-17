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

export const getAccountInfo = async (publicKey) => {
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
        valid: true,
        amount,
        decimals,
        mint: mint.toBase58(),
        owner: owner.toBase58(),
        publicKey: publicKey.toBase58(),
      };
    } catch (e) {
      return {
        valid: false,
        amount,
        decimals: 0,
        mint,
        owner,
        publicKey: publicKey.toBase58(),
      };
    }
  }

  // SOL native token
  if (!mint) {
    return {
      valid: true,
      amount: accountInfo?.lamports ?? 0,
      decimals: 9,
      mint: 'SOL',
      owner: publicKey.toBase58(),
      publicKey: publicKey.toBase58(),
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
      const balance = await getAccountInfo(pk);
      balanceList.push({
        ...balance,
        publicKey: pk.toBase58(),
      });
    }

    return balanceList;
  } catch (err) {
    throw err;
  }
};
