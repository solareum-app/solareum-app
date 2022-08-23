export const config = {
  screens: {
    Settings: {
      path: 'settings/:id?',
      parse: {
        id: (id: String) => `${id}`,
      },
    },
    EditWallet: {
      path: 'editwallet/:id?',
      parse: {
        id: (id: String) => `${id}`,
      },
    },
    Notifications: {
      path: 'notifications/:id?',
      parse: {
        id: (id: String) => `${id}`,
      },
    },
    Token: {
      path: 'token/:id?',
      parse: {
        id: (id: String) => `${id}`,
      },
    },
  },
};
