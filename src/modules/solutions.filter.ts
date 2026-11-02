import type { Solution } from './solution.model.ts';

export const FILTER_RANGE = { min: 0, max: 0.25, step: 0.01 } as const;

export const filterSolutionsByConcentration = (
  solutions: Solution[],
  min: number,
  max: number,
): Solution[] =>
  solutions.filter(
    ({ molarConcentration }) =>
      molarConcentration !== null &&
      molarConcentration >= min &&
      molarConcentration <= max,
  );
