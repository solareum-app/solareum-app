import { getUniqByAddress } from './getUniqByAddress';

describe('getUniqByAddress', () => {
  it('Should return expected value', () => {
    const list = [
      {
        address: 'a',
      },
      {
        address: 'b',
      },
      {
        address: 'a',
      },
      {
        address: 'c',
      },
    ];

    const filtered = getUniqByAddress(list);
    expect(filtered.length).toBe(3);
  });
});
