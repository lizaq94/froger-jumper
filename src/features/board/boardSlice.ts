import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardData } from '../../interfaces/BoardData.ts';
import { BoardElement } from '../../interfaces/BoardElement.ts';
import { BorderDimension } from '../../types/BorderDimension.ts';
import { Coordinates } from '../../types/Coordinates.ts';
import {
	addElementToField,
	createEmptyBoard,
	findNearestMatch,
	getFieldSafely,
	isAvailablePlace,
	removeElementFromField,
	validateBoardState,
} from '../../utils/boardUtils.ts';

const initialState: BoardData = {
	fields: [],
};

const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setBoard: (state, action: PayloadAction<BorderDimension>) => {
			state.fields = createEmptyBoard(action.payload.rows, action.payload.columns);
		},
		setElement: (state, action: PayloadAction<BoardElement>) => {
			validateBoardState(state);

			const element = action.payload;

			if (!element) throw new Error('No element was provided.');

			const field = getFieldSafely(state, element.y, element.x);

			if (field.isAvailable) {
				field.element = element;
				field.isAvailable = false;
			} else {
				throw new Error('The target field is not available.');
			}
		},
		moveElement: (state, action: PayloadAction<{ elementToMove: BoardElement; newCoordinates: Coordinates }>) => {
			validateBoardState(state);

			const { elementToMove, newCoordinates } = action.payload;
			const fieldElementToMove = getFieldSafely(state, elementToMove.y, elementToMove.x);
			const newField = getFieldSafely(state, newCoordinates.y, newCoordinates.x);

			if (elementToMove && newField?.isAvailable) {
				removeElementFromField(fieldElementToMove);
				addElementToField(newField, elementToMove, { x: newCoordinates.x, y: newCoordinates.y });
			} else {
				throw new Error('The new field is not available for placement.');
			}
		},
		setNewAdjacentElement: (
			state,
			action: PayloadAction<{ startElementCoordinates: Coordinates; newElement: BoardElement }>
		) => {
			validateBoardState(state);

			const { startElementCoordinates, newElement } = action.payload;

			const nearestAvailablePlace = findNearestMatch(
				{ x: startElementCoordinates.x, y: startElementCoordinates.y },
				state,
				isAvailablePlace
			);

			if (!nearestAvailablePlace) {
				throw new Error();
			}
			const newField = getFieldSafely(state, nearestAvailablePlace.y, nearestAvailablePlace.x);

			addElementToField(newField, newElement, { x: nearestAvailablePlace.x, y: nearestAvailablePlace.y });
		},
	},
});

export const { setBoard, setElement, moveElement, setNewAdjacentElement } = boardSlice.actions;

export default boardSlice.reducer;
