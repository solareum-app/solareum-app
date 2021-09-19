// ref: https://reactnavigation.org/docs/deep-linking/

const config = {
  screens: {
    Token: {
      path: 'token/:token/:addr',
      parse: {
        addr: (addr: any) => {
          return addr;
        },
        token: (token: any) => {
          return {
            symbol: token,
            isLinking: Math.random(),
          };
        },
      },
    },
  },
};

const linking = {
  prefixes: ['https://solareum.app'],
  config,
};

export default linking;
