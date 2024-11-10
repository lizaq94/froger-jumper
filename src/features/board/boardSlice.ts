import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardData } from '../../interfaces/BoardData.ts';
import { BoardElement } from '../../interfaces/BoardElement.ts';
import { BoardField } from '../../types/BoardField.ts';
import { BorderDimension } from '../../types/BorderDimension.ts';
import { Coordinates } from '../../types/Coordinates.ts';
import { isAvailablePlace, findNearestMatch } from '../../utils/boardUtils.ts';

const initialState: BoardData = {
	fields: [],
};

const addElementToField = (field: BoardField, element: BoardElement, coordinates: Coordinates): void => {
	element.x = coordinates.x;
	element.y = coordinates.y;
	field.element = element;
	field.isAvailable = false;
};

const removeField = (field: BoardField) => {
	field.element = null;
	field.isAvailable = true;
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
		setElement: (state, action: PayloadAction<Coordinates & { element: BoardElement }>) => {
			if (!state.fields.length) return;

			const { x, y, element } = action.payload;
			const field = state.fields[y][x];

			if (field.isAvailable) {
				field.element = element;
				field.isAvailable = false;
			}
		},
		moveElement: (
			state,
			action: PayloadAction<{ elementCoordinates: Coordinates; newCoordinates: Coordinates }>
		) => {
			if (!state.fields.length) return;
			const { elementCoordinates, newCoordinates } = action.payload;
			const fieldElementToMove = state.fields[elementCoordinates.y][elementCoordinates.x];
			const elementToMove = fieldElementToMove?.element;
			const newField = state.fields[newCoordinates.y][newCoordinates.x];

			if (elementToMove && newField?.isAvailable) {
				removeField(fieldElementToMove);
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
