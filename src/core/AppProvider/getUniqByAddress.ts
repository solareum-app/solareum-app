export const getUniqByAddress = (list) => {
  return list.filter((i, index) => {
    const aindex = list.findIndex((j) => j.address === i.address);
    return aindex === index;
  });
};
