import { Connection } from '@solana/web3.js';

import { getAccountFromSeed, mnemonicToSeed } from './wallet-account';
import { Wallet } from './wallet';
import { TOKEN_PROGRAM_ID } from './tokens/instructions';
import { parseMintData, parseTokenAccountData } from './tokens/data';

export const getConnection = () => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  return connection;
};

export const getWallet = async (recovery, name) => {
  const seed = await mnemonicToSeed(recovery);
  const seedBuffer = Buffer.from(seed, 'hex');
  const connection = new Connection('http://api.mainnet-beta.solana.com');
  const account = getAccountFromSeed(seedBuffer, 0);
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
      amount: accountInfo?.lamports ?? 0,
      decimals: 9,
      mint: null,
      owner: publicKey.toBase58(),
      valid: true,
      // add default information for solana
      coingeckoId: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      logoURI:
        'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png',
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
    const pk = publicKeys[i];
    const balance = await getBalanceInfo(pk);
    balanceList.push({
      ...balance,
      publicKey: pk.toBase58(),
    });
  }

  return balanceList;
};
