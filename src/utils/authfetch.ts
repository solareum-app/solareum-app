export const authFetch = (url: string, opts: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'A-Agent': 'solareum-app',
  };
  const body = opts.body;
  const bodyRequest = typeof body === 'string' ? body : JSON.stringify(body);

  return fetch(url, {
    ...opts,
    headers,
    body: bodyRequest,
  }).then((resp) => {
    return resp.json();
  });
};
