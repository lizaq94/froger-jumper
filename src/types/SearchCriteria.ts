import { BoardData } from '../interfaces/BoardData.ts';
import { BoardElement } from '../interfaces/BoardElement.ts';

export type SearchCriteria = (x: number, y: number, board: BoardData, element?: BoardElement) => boolean;
