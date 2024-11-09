import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '../features/board/boardSlice.ts';

export const store = configureStore({
	reducer: {
		board: boardReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
