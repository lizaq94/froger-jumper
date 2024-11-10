import { describe, expect, it } from 'vitest';
import { Sex } from '../enum/Sex.ts';
import { Trait } from '../enum/Trait.ts';
import boardReducer, {
	moveElement,
	setBoard,
	setElement,
	setNewAdjacentElement,
} from '../features/board/boardSlice.ts';
import { BoardData } from '../interfaces/BoardData.ts';
import { BoardElement } from '../interfaces/BoardElement.ts';
import { BoardField } from '../types/BoardField.ts';
import { createEmptyBoard } from '../utils/boardUtils.ts';
import { generateId } from '../utils/uuidUtils.ts';

const createMockElement = (x: number, y: number): BoardElement => ({
	id: generateId(),
	sex: Sex.MALE,
	traitHeight: Trait.TALL,
	traitWeight: Trait.FAT,
	x,
	y,
});

export const createFullBoardMock = (rows: number, columns: number): BoardField[][] => {
	return Array.from({ length: rows }, (_, rowsIndex) =>
		Array.from({ length: columns }, (_, columnsIndex) => ({
			element: createMockElement(columnsIndex, rowsIndex),
			isAvailable: false,
		}))
	);
};

describe('boardSlice', () => {
	describe('setBoard', () => {
		it('should set 4x4 board ', () => {
			const initialState: BoardData = {
				fields: [],
			};
			const boardDimension = { rows: 4, columns: 4 };

			const nextState = boardReducer(initialState, setBoard(boardDimension));

			expect(nextState.fields.length).toEqual(boardDimension.rows);
			expect(nextState.fields[0].length).toEqual(boardDimension.columns);
		});
	});

	describe('setElement', () => {
		it('should set element in available field', () => {
			const initialState: BoardData = { fields: createEmptyBoard(3, 3) };
			const element: BoardElement = createMockElement(1, 1);

			const nextState = boardReducer(initialState, setElement(element));

			expect(nextState.fields[1][1]).toStrictEqual({
				element,
				isAvailable: false,
			});
		});

		it('should not set element in unavailable field', () => {
			const element: BoardElement = createMockElement(1, 1);

			const newElement: BoardElement = createMockElement(1, 1);

			const initialState: BoardData = { fields: createEmptyBoard(3, 3) };
			initialState.fields[1][1] = {
				element,
				isAvailable: false,
			};

			expect(() => boardReducer(initialState, setElement(newElement))).toThrow(
				'The target field is not available.'
			);
		});
	});

	describe('moveElement', () => {
		it('should move element in available field', () => {
			const initialState: BoardData = { fields: createEmptyBoard(3, 3) };

			const element: BoardElement = createMockElement(1, 1);

			initialState.fields[1][1] = {
				element,
				isAvailable: false,
			};

			const newCoordinates = { x: 2, y: 2 };

			const nextState = boardReducer(initialState, moveElement({ elementToMove: element, newCoordinates }));

			expect(nextState.fields[2][2].element?.id).toEqual(element.id);
		});

		it('should not move element in unavailable field', () => {
			const firstElement: BoardElement = createMockElement(1, 1);

			const secondElement: BoardElement = createMockElement(2, 2);

			const initialState: BoardData = { fields: createEmptyBoard(3, 3) };
			initialState.fields[1][1] = {
				element: firstElement,
				isAvailable: false,
			};
			initialState.fields[2][2] = {
				element: secondElement,
				isAvailable: false,
			};

			const newCoordinates = { x: 2, y: 2 };

			expect(() =>
				boardReducer(initialState, moveElement({ elementToMove: firstElement, newCoordinates }))
			).toThrow('The new field is not available for placement.');
		});
	});

	describe('setNewAdjacentElement', () => {
		it('should set element in adjacent field', () => {
			const initialState: BoardData = { fields: createEmptyBoard(3, 3) };

			const elementOnBoard: BoardElement = createMockElement(0, 0);

			const newElement: BoardElement = createMockElement(0, 0);

			initialState.fields[0][0] = {
				element: elementOnBoard,
				isAvailable: false,
			};

			const nextState = boardReducer(
				initialState,
				setNewAdjacentElement({
					startElementCoordinates: { x: elementOnBoard.x, y: elementOnBoard.y },
					newElement: newElement,
				})
			);

			expect(nextState.fields[1][0].element?.id).toEqual(newElement.id);
		});

		it('should throw error when not found adjacent field', () => {
			const initialState: BoardData = { fields: createFullBoardMock(2, 2) };

			const firstElement: BoardElement = createMockElement(1, 1);

			const secondElement: BoardElement = createMockElement(0, 0);

			expect(() =>
				boardReducer(
					initialState,
					setNewAdjacentElement({
						startElementCoordinates: { x: firstElement.x, y: firstElement.y },
						newElement: secondElement,
					})
				)
			).toThrow('No nearest available place found.');
		});
	});
});
