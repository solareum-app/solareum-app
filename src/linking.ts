const config = {
  screens: {
    Token: {
      path: 'token/:token',
      parse: {
        token: (token: any) => token,
      },
    },
  },
};

const linking = {
  prefixes: ['https://solareum.app'],
  config,
};

export default linking;
