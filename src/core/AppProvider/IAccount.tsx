import { TokenInfo } from '@solana/spl-token-registry';

export type IAccount = {
  mint: string;
  publicKey: string;
  owner: string;
  amount: number;
  decimals: number;
  valid: boolean;
  value: number;
  refValue: number;
  isMinted: boolean;
  usd: number;
  vnd: number;
  name: string;
  sortName: string;
  isHiding: boolean;
} & TokenInfo;

export const createAccountList = (
  tokenList: TokenInfo[],
  accountList: any[],
  priceData = {},
): IAccount[] => {
  // if tokenList is not provided, just use account info
  if (!tokenList.length) {
    return accountList;
  }

  const activeAccountList = accountList.filter((i) => i.publicKey);
  const accountIdList = activeAccountList.map((i) => i.mint).join(',');

  // filled token info for existing account list
  const filledAccountList = [...activeAccountList].map((account) => {
    const token = tokenList.find((t) => t.address === account.mint) || null;
    if (!token) {
      return null;
    }

    const id = token.extensions?.coingeckoId || '-';
    const price = priceData[id] || account;
    const usd = price.usd || 0;
    const amount = account.amount || 0;
    const decimals = account.decimals || 0;
    const value = (amount / Math.pow(10, decimals)) * usd;
    const refValue = (amount / Math.pow(10, decimals)) * (usd || 0.0001);
    const sortName = token.name
      ? token.name
          .replace('Wrapped', '')
          .replace('(Sollet)', '')
          .replace('(Wormhole)', '')
          .trim()
      : '-';

    return {
      ...token,
      mint: account.mint || '',
      publicKey: account.publicKey || '',
      owner: account.owner || '',
      amount,
      decimals,
      value,
      refValue,
      valid: account.valid || false,
      isMinted: !!account.publicKey,
      usd: price.usd || 0,
      vnd: price.vnd || 0,
      sortName,
      isHiding: account.isHiding || false,
    } as IAccount;
  });

  const filledTokenList = [...tokenList]
    // filter non-created token
    .filter((t) => accountIdList.indexOf(t.address) < 0)
    .map((i) => {
      const id = i.extensions?.coingeckoId || '-';
      const account = {};
      const price = priceData[id] || account;
      const usd = price.usd || 0;
      const amount = account.amount || 0;
      const decimals = account.decimals || 0;
      const value = (amount / Math.pow(10, decimals)) * usd;
      const refValue = (amount / Math.pow(10, decimals)) * (usd || 0.0001);
      const sortName = i.name
        ? i.name
            .replace('Wrapped', '')
            .replace('(Sollet)', '')
            .replace('(Wormhole)', '')
            .trim()
        : '-';

      return {
        ...i,
        mint: account.mint || '',
        publicKey: account.publicKey || '',
        owner: account.owner || '',
        amount,
        decimals,
        value,
        refValue,
        valid: account.valid || false,
        isMinted: !!account.publicKey,
        usd: price.usd || 0,
        vnd: price.vnd || 0,
        sortName,
      } as IAccount;
    });

  return [...filledAccountList, ...filledTokenList].filter((a) => !!a);
};
