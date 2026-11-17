import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userId: number | null;
  username: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<{ id: number; username: string }>) {
      state.isAuthenticated = true;
      state.userId = payload.id;
      state.username = payload.username;
    },
    clearUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: { type: string; payload?: unknown }) =>
        action.type.endsWith('/rejected') &&
        (action.payload as { status?: number } | undefined)?.status === 401,
      () => initialState,
    );
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
