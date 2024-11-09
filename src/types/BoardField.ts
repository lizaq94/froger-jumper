import { BoardElement } from '../interfaces/BoardElement.ts';

export type BoardField = {
	element: BoardElement | null;
	isAvailable: boolean;
};
