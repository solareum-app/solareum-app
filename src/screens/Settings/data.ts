import { MenuGroupType } from './types';
import { COLORS } from '../../theme/colors';

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
        name: 'Preferences',
        icon: {
          name: 'setting',
          color: 'red',
        },
      },
    ],
  },
  {
    name: 'Join Community',
    items: [
      {
        name: 'Community',
        icon: {
          name: 'questioncircle',
          color: COLORS.warning,
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
    ],
  },
  {
    name: null,
    items: [
      {
        name: 'Version 2.0.4',
        icon: {
          name: 'heart',
          color: '#e25555',
        },
      },
    ],
  },
];
