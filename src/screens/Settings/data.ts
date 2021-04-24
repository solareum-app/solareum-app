import { MenuGroupType } from './types';

export const groups: MenuGroupType[] = [
  {
    name: null,
    items: [
      {
        name: 'Security',
        icon: {
          name: 'lock',
          color: 'grey',
        },
      },
      {
        name: 'Push Notifications',
        icon: {
          name: 'notification',
          color: 'red',
        },
      },
      {
        name: 'Preferences',
        icon: {
          name: 'setting',
          color: 'red',
        },
      },
    ],
  },
  {
    name: null,
    items: [
      {
        name: 'Price Alerts',
        icon: {
          name: 'questioncircle',
          color: 'red',
        },
      },
    ],
  },
  {
    name: null,
    items: [
      {
        name: 'WalletConnect',
        icon: {
          name: 'questioncircle',
          color: 'red',
        },
      },
    ],
  },
  {
    name: 'Join Community',
    items: [
      {
        name: 'Help Center',
        icon: {
          name: 'questioncircle',
          color: '#f4b400',
        },
      },
      {
        name: 'Twitter',
        icon: {
          name: 'twitter',
          color: '#00acee',
        },
      },
      {
        name: 'Telegram',
        icon: {
          name: 'questioncircle',
          color: '#0088cc',
        },
      },
      {
        name: 'Facebook',
        icon: {
          name: 'facebook-square',
          color: '#3b5998',
        },
      },
      {
        name: 'Reddit',
        icon: {
          name: 'questioncircle',
          color: '#ff4301',
        },
      },
      {
        name: 'Youtube',
        icon: {
          name: 'youtube',
          color: '#ff0000',
        },
      },
    ],
  },
  {
    name: null,
    items: [
      {
        name: 'About',
        icon: {
          name: 'heart',
          color: '#e25555',
        },
      },
    ],
  },
];
