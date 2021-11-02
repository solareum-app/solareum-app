export const getShortHash = (hash: string) => {
  if (hash.length <= 12) {
    return hash;
  }
  return `${hash.slice(0, 6)}...${hash.slice(hash.length - 6)}`;
};
