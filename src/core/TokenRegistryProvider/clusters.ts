import { MAINNET_URL } from '../../config';
import { Cluster } from './types';

export const CLUSTERS: Cluster[] = [
  {
    name: 'mainnet-beta',
    apiUrl: MAINNET_URL,
    label: 'Mainnet Beta',
  },
  {
    name: 'localnet',
    apiUrl: 'http://localhost:8899',
    label: null,
  },
];

export const clusterForEndpoint = (endpoint: string) => {
  return CLUSTERS.find(({ apiUrl }) => apiUrl === endpoint);
};
