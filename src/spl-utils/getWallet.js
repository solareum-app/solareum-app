import { Connection } from '@solana/web3.js';

import { getAccountFromSeed, mnemonicToSeed } from './wallet-account';
import { Wallet } from './wallet';
import { TOKEN_PROGRAM_ID } from './tokens/instructions';
import {
  ACCOUNT_LAYOUT,
  parseMintData,
  parseTokenAccountData,
} from './tokens/data';

const recoveryPhrase =
  'unveil dust trophy deputy wear sorry limb announce initial seek property edge area target broken suspect rapid that job next toast expose enable prison';

export const getConnection = () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  return connection;
};

export const getWallet = async () => {
  const seed = await mnemonicToSeed(recoveryPhrase);
  const seedBuffer = Buffer.from(seed, 'hex');
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const account = getAccountFromSeed(seedBuffer, 0);
  const wallet = new Wallet(connection, 'custody', { account });

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
        mint,
        owner,
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

  if (!mint) {
    return {
      amount: accountInfo?.lamports ?? 0,
      decimals: 9,
      mint: null,
      owner: publicKey,
      tokenName: 'SOL',
      tokenSymbol: 'SOL',
      valid: true,
    };
  }

  return null;
};

export const getBalanceList = async (wallet) => {
  const tokenAccountInfo = (await wallet.getTokenAccountInfo()) || [];
  const publicKeys = [
    wallet.publicKey,
    ...tokenAccountInfo.map(({ publicKey }) => publicKey),
  ];

  const balanceList = [];

  for (let i = 0; i < publicKeys.length; i++) {
    const balance = await getBalanceInfo(publicKeys[i]);
    balanceList.push(balance);
  }

  return balanceList;
};
