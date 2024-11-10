import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardData } from '../../interfaces/BoardData.ts';
import { BoardElement } from '../../interfaces/BoardElement.ts';
import { BorderDimension } from '../../types/BorderDimension.ts';
import { Coordinates } from '../../types/Coordinates.ts';
import {
	addElementToField,
	findNearestMatch,
	isAvailablePlace,
	removeElementFromField,
} from '../../utils/boardUtils.ts';

const initialState: BoardData = {
	fields: [],
};

const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setBoard: (state, action: PayloadAction<BorderDimension>) => {
			state.fields = Array.from({ length: action.payload.rows }, () =>
				Array.from({ length: action.payload.columns }, () => ({
					element: null,
					isAvailable: true,
				}))
			);
		},
		setElement: (state, action: PayloadAction<BoardElement>) => {
			if (!state.fields.length) return;

			const element = action.payload;

			if (!element) return;

			const field = state.fields[element.y][element.x];

			if (field.isAvailable) {
				field.element = element;
				field.isAvailable = false;
			}
		},
		moveElement: (state, action: PayloadAction<{ elementToMove: BoardElement; newCoordinates: Coordinates }>) => {
			if (!state.fields.length) return;
			const { elementToMove, newCoordinates } = action.payload;
			const fieldElementToMove = state.fields[elementToMove.y][elementToMove.x];
			const newField = state.fields[newCoordinates.y][newCoordinates.x];

			if (elementToMove && newField?.isAvailable) {
				removeElementFromField(fieldElementToMove);
				addElementToField(newField, elementToMove, { x: newCoordinates.x, y: newCoordinates.y });
			}
		},
		setNewAdjacentElement: (
			state,
			action: PayloadAction<{ startElementCoordinates: Coordinates; newElement: BoardElement }>
		) => {
			if (!state.fields.length) return;

			const { startElementCoordinates, newElement } = action.payload;

			const nearestAvailablePlace = findNearestMatch(
				{ x: startElementCoordinates.x, y: startElementCoordinates.y },
				state,
				isAvailablePlace
			);

			if (!nearestAvailablePlace) {
				return;
			}
			const newField = state.fields[nearestAvailablePlace.y][nearestAvailablePlace.x];

			addElementToField(newField, newElement, { x: nearestAvailablePlace.x, y: nearestAvailablePlace.y });
		},
	},
});

export const { setBoard, setElement, moveElement, setNewAdjacentElement } = boardSlice.actions;

export default boardSlice.reducer;
