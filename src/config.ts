export const MAINNET_URL = 'http://api.mainnet-beta.solana.com';

// DEV
// export const XSB_PATH = 'https://xsb-stg.solareum.app/api/v1';
// export const API_PATH = 'https://api-stg.solareum.app';

// PROD
export const XSB_PATH = 'https://xsb.solareum.app/api/v1';
export const API_PATH = 'https://api.solareum.app';

export let service = {
  postDeviceRegister: `${XSB_PATH}/device/register`,

  postCheckAirdrop: `${XSB_PATH}/airdrop/check`,
  postAirdrop: `${XSB_PATH}/airdrop/get`,

  postCheckMission: `${XSB_PATH}/mission/check`,
  postMission: `${XSB_PATH}/mission/get`,
};
