import { BoardData } from '../interfaces/BoardData.ts';
import { BoardElement } from '../interfaces/BoardElement.ts';
import { Coordinates } from '../types/Coordinates.ts';
import { SearchCriteria } from '../types/SearchCriteria.ts';

const isCoordinatesAreOnBoard = (x: number, y: number, board: BoardData): boolean => {
	const rows = board.fields.length;
	const columns = board.fields[0].length;

	return x >= 0 && x < columns && y >= 0 && y < rows;
};

export const findNearestMatch = (
	startCoordinates: Coordinates,
	board: BoardData,
	criteria: SearchCriteria,
	element?: BoardElement,
	maxDistance: number = Infinity
): Coordinates | null => {
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

	const queue = [{ ...startCoordinates, distance: 0 }];
	const visited = new Set();
	visited.add(`${startCoordinates.x},${startCoordinates.y}`);

	while (queue.length > 0) {
		const { x, y, distance }: Coordinates & { distance: number } = queue.shift()!;

		if (distance > maxDistance) {
			continue;
		}

		for (const [directionX, directionY] of directions) {
			const newX = x + directionX;
			const newY = y + directionY;

			if (!visited.has(`${newX},${newY}`) && isCoordinatesAreOnBoard(newX, newY, board)) {
				visited.add(`${newX},${newY}`);
				if (criteria(newX, newY, board, element)) {
					return { x: newX, y: newY };
				}
				queue.push({ x: newX, y: newY, distance: distance + 1 });
			}
		}
	}

	return null;
};

export const isOppositeSexPartner = (x: number, y: number, board: BoardData, element?: BoardElement): boolean => {
	const fieldElement = board.fields[y][x]?.element;
	return fieldElement != null && element?.sex !== fieldElement.sex;
};

export const isAvailablePlace = (x: number, y: number, board: BoardData): boolean => {
	return board.fields[y][x].isAvailable;
};