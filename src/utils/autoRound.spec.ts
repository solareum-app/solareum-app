import { mostSigFig, leastSigFig, roundDown, roundUp } from './autoRound';

describe('Auto Rounding', () => {
  it('mostSigFig', () => {
    expect(mostSigFig(0.15123)).toBe(-0);
    expect(mostSigFig(876543.21)).toBe(6);
    expect(mostSigFig(7654.321)).toBe(4);
    expect(mostSigFig(Math.pow(10, -17))).toBe(-12);
    expect(mostSigFig(0.012333333322)).toBe(-1);
    expect(mostSigFig(0.00113301)).toBe(-2);
    expect(mostSigFig(0.00000177)).toBe(-5);
  });
  it('leastSigFig', () => {
    // sigFig = 3
    expect(leastSigFig(0.15123, 3)).toBe(3);
    // sigFig = 5 as default
    expect(leastSigFig(0.15123)).toBe(5);
    expect(leastSigFig(876543.21)).toBe(-1);
    expect(leastSigFig(7654.321)).toBe(1);
    expect(leastSigFig(Math.pow(10, -17))).toBe(10);
    expect(leastSigFig(0.012333333322)).toBe(6);
    expect(leastSigFig(0.00113301)).toBe(7);
    expect(leastSigFig(0.00000177)).toBe(10);
  });
  it('roundDown', () => {
    // sigfig = 3
    expect(roundDown(12.3456, 3)).toBe('12.3');
    expect(roundDown(0.485, 3)).toBe('0.485');
    expect(roundDown(7.088, 3)).toBe('7.08');
    expect(roundDown(-7.088, 3)).toBe('-7.09');
    // basic
    expect(roundDown(123.456)).toBe('123.45');
    expect(roundDown(12.3456)).toBe('12.345');
    // from excel sheet
    expect(roundDown(0.15123)).toBe('0.15123');
    expect(roundDown(876543.21)).toBe('876540');
    expect(roundDown(7654.321)).toBe('7654.3');
    expect(roundDown(Math.pow(10, -17))).toBe('0.0000000000');
    expect(roundDown(0.012333333322)).toBe('0.012333');
    expect(roundDown(0.00113301)).toBe('0.0011330');
    expect(roundDown(0.00000177)).toBe('0.0000017700');
  });
  it('roundUp', () => {
    // sigfig = 3
    expect(roundUp(12.3456, 3)).toBe('12.4');
    expect(roundUp(0.485, 3)).toBe('0.485');
    expect(roundUp(7.088, 3)).toBe('7.09');
    expect(roundUp(-7.088, 3)).toBe('-7.08');
    // basic
    expect(roundUp(123.456)).toBe('123.46');
    expect(roundUp(12.3456)).toBe('12.346');
    // from excel sheet
    expect(roundUp(0.15123)).toBe('0.15123');
    expect(roundUp(876543.21)).toBe('876550');
    expect(roundUp(7654.321)).toBe('7654.4');
    expect(roundUp(Math.pow(10, -17))).toBe('0.0000000001');
    expect(roundUp(0.012333333322)).toBe('0.012334');
    expect(roundUp(0.00113301)).toBe('0.0011331');
    expect(roundUp(0.00000177)).toBe('0.0000017700');
  });
});
