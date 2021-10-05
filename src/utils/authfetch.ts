import { API_PATH } from '../config';

export const authFetch = (url: string, opts: any = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'A-Agent': 'solareum-app',
  };
  const actualUrl = url.startsWith('/') ? `${API_PATH}${url}` : url;
  const body = opts.body;
  const bodyRequest = typeof body === 'string' ? body : JSON.stringify(body);

  return fetch(actualUrl, {
    ...opts,
    headers,
    body: bodyRequest,
  }).then((resp) => {
    return resp.json();
  });
};
