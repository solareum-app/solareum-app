const SIG_FIG = 5;
const DEFAULT_CLAMP = 10;

export const mostSigFig = (value: number) => {
  return Math.ceil(
    Math.log10(Math.max(Math.abs(value), Math.abs(Math.pow(10, -12)))),
  );
};

export const leastSigFig = (value: number, sigFig?: number, clamp?: number) => {
  return Math.min(
    clamp || DEFAULT_CLAMP,
    (sigFig || SIG_FIG) - mostSigFig(value),
  );
};

export const roundDown = (value: number, sigFig?: number, clamp?: number) => {
  const lsf = leastSigFig(value, sigFig, clamp);
  const fixed = lsf < 0 ? 0 : lsf;
  return (Math.floor(value * Math.pow(10, lsf)) / Math.pow(10, lsf)).toFixed(
    fixed,
  );
};

export const roundUp = (value: number, sigFig?: number, clamp?: number) => {
  const lsf = leastSigFig(value, sigFig, clamp);
  const fixed = lsf < 0 ? 0 : lsf;
  return (Math.ceil(value * Math.pow(10, lsf)) / Math.pow(10, lsf)).toFixed(
    fixed,
  );
};

export const price = (value: number, sigFig?: number, clamp?: number) => {
  if (value === 0) {
    return '0.00';
  }

  return roundDown(value, sigFig, clamp).replace(/(\.0+|0+)$/, '');
};
