import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FILTER_RANGE, filterSolutionsByConcentration } from '../../modules/solutions.filter.ts';
import type { Solution } from '../../modules/solution.model.ts';
import { SOLUTIONS_MOCK } from '../../modules/solutions.mock.ts';
import { clearUser } from './userSlice.ts';
import {
  deleteSolution,
  fetchSolutions,
  likeSolution,
  publishSolution,
} from '../thunks/solutions.thunks.ts';

interface SolutionsState {
  cards: Solution[];
  min: number;
  max: number;
  loading: boolean;
  loaded: boolean;
  isMock: boolean;
}

const initialState: SolutionsState = {
  cards: [],
  min: FILTER_RANGE.min,
  max: FILTER_RANGE.max,
  loading: false,
  loaded: false,
  isMock: false,
};

const solutionsSlice = createSlice({
  name: 'solutions',
  initialState,
  reducers: {
    setMin(state, { payload }: PayloadAction<number>) {
      state.min = payload;
    },
    setMax(state, { payload }: PayloadAction<number>) {
      state.max = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolutions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.loaded = true;
        state.isMock = false;
        state.cards = payload;
      })
      .addCase(fetchSolutions.rejected, (state, { meta, payload }) => {
        state.loading = false;
        state.loaded = true;
        if (payload?.offline) {
          state.isMock = true;
          state.cards = filterSolutionsByConcentration(
            SOLUTIONS_MOCK,
            meta.arg.min,
            meta.arg.max,
          );
        }
      })
      .addCase(likeSolution.fulfilled, (state, { payload }) => {
        state.cards = state.cards.map((card) => (card.id === payload.id ? payload : card));
      })
      .addCase(deleteSolution.fulfilled, (state, { payload }) => {
        state.cards = state.cards.filter((card) => card.id !== payload);
      })
      .addCase(publishSolution.fulfilled, (state, { payload }) => {
        state.cards = [...state.cards.filter((card) => card.id !== payload.id), payload];
      })
      .addCase(clearUser, (state) => {
        state.min = FILTER_RANGE.min;
        state.max = FILTER_RANGE.max;
      })
      .addMatcher(isAnyOf(deleteSolution.pending, likeSolution.pending), (state) => {
        state.loading = true;
      })
      .addMatcher(
        isAnyOf(
          deleteSolution.fulfilled,
          deleteSolution.rejected,
          likeSolution.fulfilled,
          likeSolution.rejected,
        ),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export const { setMin, setMax } = solutionsSlice.actions;
export default solutionsSlice.reducer;
