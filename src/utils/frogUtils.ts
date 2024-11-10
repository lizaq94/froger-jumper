import { Sex } from '../enum/Sex.ts';
import { BoardElement } from '../interfaces/BoardElement.ts';
import { getRandomArrayElement } from './arrayUtils.ts';
import { generateId } from './uuidUtils.ts';

export const createNewFrog = (firstParent: BoardElement, secondParent: BoardElement): BoardElement => {
	const sex = getRandomArrayElement([Sex.MALE, Sex.FEMALE]);
	const traitHeight = getRandomArrayElement([firstParent.traitHeight, secondParent.traitHeight]);
	const traitWeight = getRandomArrayElement([firstParent.traitWeight, secondParent.traitWeight]);

	return {
		id: generateId(),
		sex,
		traitHeight,
		traitWeight,
		x: 0,
		y: 0,
	};
};
