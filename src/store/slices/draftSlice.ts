import { createSlice } from '@reduxjs/toolkit';
import type { Solution } from '../../modules/solution.model.ts';
import { clearUser } from './userSlice.ts';
import {
  createSolutionDraft,
  fetchSolutionDraft,
  publishSolution,
} from '../thunks/solutions.thunks.ts';

interface DraftState {
  draft: Solution | null;
  loading: boolean;
  errorStatus: number | null;
}

const initialState: DraftState = {
  draft: null,
  loading: false,
  errorStatus: null,
};

const onPending = (state: DraftState) => {
  state.loading = true;
  state.errorStatus = null;
};

const onRejected = (state: DraftState, { payload }: { payload?: { status: number | null } }) => {
  state.loading = false;
  state.errorStatus = payload?.status ?? 0;
};

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolutionDraft.pending, onPending)
      .addCase(fetchSolutionDraft.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.draft = payload;
      })
      .addCase(fetchSolutionDraft.rejected, onRejected)
      .addCase(createSolutionDraft.pending, onPending)
      .addCase(createSolutionDraft.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.draft = payload;
      })
      .addCase(createSolutionDraft.rejected, onRejected)
      .addCase(publishSolution.pending, onPending)
      .addCase(publishSolution.fulfilled, (state) => {
        state.loading = false;
        state.draft = null;
      })
      .addCase(publishSolution.rejected, onRejected)
      .addCase(clearUser, () => initialState);
  },
});

export default draftSlice.reducer;
