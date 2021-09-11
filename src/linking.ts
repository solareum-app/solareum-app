const config = {
  screens: {
    Nhà: {
      screens: {
        Wallet: 'wallet',
        DEX: 'dex',
        Social: 'social',
      },
      path: 'home',
    },
    Token: {
      path: 'token/:token',
      parse: {
        token: (token: any) => token,
      },
    },
    'Cấu hình': 'settings',
  },
};

const linking = {
  prefixes: ['https://solareum.app'],
  config,
};

export default linking;
