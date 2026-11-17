import { createSlice } from '@reduxjs/toolkit';
import type { Solution } from '../../modules/solution.model.ts';
import { SOLUTIONS_MOCK } from '../../modules/solutions.mock.ts';
import {
  deleteSolution,
  fetchSolutionFeed,
  likeSolution,
} from '../thunks/solutions.thunks.ts';
import type { SolutionFeedArg } from '../thunks/solutions.thunks.ts';

interface FeedState {
  solution: Solution | null;
  loading: boolean;
  notFound: boolean;
}

const initialState: FeedState = {
  solution: null,
  loading: false,
  notFound: false,
};

const findInMock = ({ id, next }: SolutionFeedArg): Solution | null => {
  if (id === undefined) return SOLUTIONS_MOCK[0] ?? null;
  const index = SOLUTIONS_MOCK.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return next ? SOLUTIONS_MOCK[(index + 1) % SOLUTIONS_MOCK.length] : SOLUTIONS_MOCK[index];
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutionFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSolutionFeed.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.notFound = false;
        state.solution = payload;
      })
      .addCase(fetchSolutionFeed.rejected, (state, { meta, payload }) => {
        state.loading = false;
        const solution = payload?.offline ? findInMock(meta.arg) : null;
        state.solution = solution;
        state.notFound = solution === null;
      })
      .addCase(likeSolution.fulfilled, (state, { payload }) => {
        if (state.solution?.id === payload.id) state.solution = payload;
      })
      .addCase(deleteSolution.fulfilled, (state, { payload }) => {
        if (state.solution?.id === payload) state.solution = null;
      });
  },
});

export default feedSlice.reducer;
