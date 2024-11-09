import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardData } from '../../interfaces/BoardData.ts';
import { BoardElement } from '../../interfaces/BoardElement.ts';
import { BoardField } from '../../types/BoardField.ts';
import { BorderDimension } from '../../types/BorderDimension.ts';
import { Coordinates } from '../../types/Coordinates.ts';

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

const isCoordinatesAreOnBoard = (x: number, y: number, board: BoardData): boolean => {
	const rows = board.fields.length;
	const columns = board.fields[0].length;

	return x >= 0 && x < columns && y >= 0 && y < rows;
};

const findNearestAvailablePlace = (startCoordinates: Coordinates, board: BoardData): Coordinates | null => {
	const directions = [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0],
		[1, 1],
		[-1, -1],
		[1, -1],
		[-1, 1],
	];

	const queue = [startCoordinates];
	const visited = new Set();
	visited.add(`${startCoordinates.x},${startCoordinates.y}`);

	while (queue.length > 0) {
		const { x, y }: Coordinates = queue.shift()!;

		for (const [directionX, directionY] of directions) {
			const newX = x + directionX;
			const newY = y + directionY;

			const isNewCoordinatesAreOnBoard = isCoordinatesAreOnBoard(newX, newY, board);
			const isNewPlaceIsAvailable = isNewCoordinatesAreOnBoard && board.fields[newY][newX].isAvailable;

			if (isNewPlaceIsAvailable) {
				return { x: newX, y: newY };
			}

			if (!visited.has(`${newX},${newY}`) && isNewCoordinatesAreOnBoard) {
				visited.add(`${newX},${newY}`);
				queue.push({ x: newX, y: newY });
			}
		}
	}

	return null;
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

			const nearestPlaceCoordinates = findNearestAvailablePlace(
				{ x: startElementCoordinates.x, y: startElementCoordinates.y },
				state
			);

			if (!nearestPlaceCoordinates) {
				return;
			}
			const newField = state.fields[nearestPlaceCoordinates.y][nearestPlaceCoordinates.x];

			addElementToField(newField, newElement, { x: nearestPlaceCoordinates.x, y: nearestPlaceCoordinates.y });
		},
	},
});

export const { setBoard, setElement, moveElement, setNewAdjacentElement } = boardSlice.actions;

export default boardSlice.reducer;
