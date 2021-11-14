// export const MAINNET_URL = 'http://api.mainnet-beta.solana.com';
export const MAINNET_URL = 'https://solana-api.projectserum.com';

// DEV
// export const XSB_PATH = 'https://xsb-stg.solareum.app/api/v1';
// export const API_PATH = 'https://api-stg.solareum.app';

// PROD
export const XSB_PATH = 'https://xsb.solareum.app/api/v1';
export const API_PATH = 'https://api.solareum.app';

export let service = {
  postWalletNew: `${XSB_PATH}/wallet/new`,
  postWalletUpdate: `${XSB_PATH}/wallet/update`,

  postCheckAirdrop: `${XSB_PATH}/airdrop/check`,
  postAirdrop: `${XSB_PATH}/airdrop/get`,

  postCheckMission: `${XSB_PATH}/mission/check`,
  postMission: `${XSB_PATH}/mission/get`,

  purchaseSubmit: `${XSB_PATH}/purchase/submit`,
  purchaseDistribute: `${XSB_PATH}/purchase/distribute`,
};
