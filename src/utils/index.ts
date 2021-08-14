export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const getShortPublicKey = (key: string) => {
  const visible = 5;
  return `${key.slice(0, visible)}...${key.slice(
    key.length - visible,
    key.length,
  )}`;
};
