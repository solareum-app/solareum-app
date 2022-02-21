import axios from 'axios';
import { API_PATH } from '../config';

export const authFetch = (url: string, opts: any = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'A-Agent': 'solareum-app',
  };
  const actualUrl = url.startsWith('/') ? `${API_PATH}${url}` : url;
  const body = opts.body;

  return axios({
    method: opts.method || 'get',
    ...opts,
    headers: {
      ...headers,
      ...opts.headers,
    },
    url: actualUrl,
    data: body,
  }).then((resp) => resp.data);
};
