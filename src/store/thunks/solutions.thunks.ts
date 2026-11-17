import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/index.ts';
import type { PublishSolutionDto } from '../../api/Api.ts';
import type { Solution } from '../../modules/solution.model.ts';
import { toRequestFailure } from './request-failure.ts';
import type { RequestFailure } from './request-failure.ts';

const thunk = createAsyncThunk.withTypes<{ rejectValue: RequestFailure }>();

export interface SolutionsFilter {
  min: number;
  max: number;
}

export interface SolutionFeedArg {
  id?: number;
  next?: boolean;
}

export interface CreateSolutionDraftArg {
  substanceName: string;
  image: File;
  video: File;
}

export interface PublishSolutionArg extends PublishSolutionDto {
  id: number;
}

export interface LikeSolutionArg {
  id: number;
  value: 0 | 1;
}

export const fetchSolutions = thunk<Solution[], SolutionsFilter>(
  'solutions/fetchSolutions',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await api.solutions.getSolutionsList(filter);
      return response.data;
    } catch (error) {
      return rejectWithValue(toRequestFailure(error));
    }
  },
);

export const fetchSolutionFeed = thunk<Solution, SolutionFeedArg>(
  'solutions/fetchSolutionFeed',
  async ({ id, next }, { rejectWithValue }) => {
    try {
      const query = next ? { next: true } : undefined;
      const response =
        id === undefined
          ? await api.solutions.getSolutionFeed(undefined, query)
          : await api.solutions.getSolutionFeedById(id, query);
      return response.data;
    } catch (error) {
      return rejectWithValue(toRequestFailure(error));
    }
  },
);

export const fetchSolutionDraft = thunk<Solution | null>(
  'solutions/fetchSolutionDraft',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.solutions.getSolutionDraft();
      return response.data;
    } catch (error) {
      const failure = toRequestFailure(error);
      return failure.status === 404 ? null : rejectWithValue(failure);
    }
  },
);

export const createSolutionDraft = thunk<Solution, CreateSolutionDraftArg>(
  'solutions/createSolutionDraft',
  async (draft, { rejectWithValue }) => {
    try {
      const response = await api.solutions.createSolutionDraft(draft);
      return response.data;
    } catch (error) {
      return rejectWithValue(toRequestFailure(error));
    }
  },
);

export const publishSolution = thunk<Solution, PublishSolutionArg>(
  'solutions/publishSolution',
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const response = await api.solutions.publishSolution(id, fields);
      return response.data;
    } catch (error) {
      return rejectWithValue(toRequestFailure(error));
    }
  },
);

export const deleteSolution = thunk<number, number>(
  'solutions/deleteSolution',
  async (id, { rejectWithValue }) => {
    try {
      await api.solutions.deleteSolution(id);
      return id;
    } catch (error) {
      return rejectWithValue(toRequestFailure(error));
    }
  },
);

export const likeSolution = thunk<Solution, LikeSolutionArg>(
  'solutions/likeSolution',
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.solutions.likeSolution(id, { value });
      return response.data;
    } catch (error) {
      return rejectWithValue(toRequestFailure(error));
    }
  },
);
