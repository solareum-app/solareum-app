export type BackupData = {
  publicKey: string;
  privateKey: string;
  name: string;
};

export const mergeWallets = (
  newList: BackupData[],
  oldList: BackupData[],
): BackupData[] => {
  return [...newList].concat(oldList).filter((item, index, self) => {
    // remove existing items
    return self.findIndex((i) => i.publicKey === item.publicKey) === index;
  });
};
