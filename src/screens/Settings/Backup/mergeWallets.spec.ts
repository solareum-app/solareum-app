import { mergeWallets, BackupData } from './mergeWallets';

describe('merge wallet', () => {
  it('should return the new list', () => {
    const newList: BackupData[] = [
      {
        publicKey: 'pub01',
        privateKey: 'PK01',
        name: 'Name 01',
      },
    ];
    const oldList = [
      {
        publicKey: 'pub02',
        privateKey: 'pk02',
        name: 'Name 02',
      },
    ];

    const list = mergeWallets(newList, oldList);

    expect(list.length).toBe(2);
    expect(list[0].publicKey).toBe('pub01');
    expect(list[1].publicKey).toBe('pub02');
  });

  it('should omit same item', () => {
    const newList: BackupData[] = [
      {
        publicKey: 'pub01',
        privateKey: 'PK111',
        name: 'Test 01',
      },
    ];
    const oldList = [
      {
        publicKey: 'pub01',
        privateKey: 'PK222',
        name: 'Test 02',
      },
    ];
    const list = mergeWallets(newList, oldList);

    expect(list.length).toBe(1);
    expect(list[0].privateKey).toBe('PK111');
  });
});
