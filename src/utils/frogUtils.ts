import { Sex } from '../enum/Sex.ts';
import { BoardElement } from '../interfaces/BoardElement.ts';
import { generateId } from './uuidUtils.ts';

export const createNewFrog = (firstParent: BoardElement, secondParent: BoardElement): BoardElement => {
	const sex = Math.random() < 0.5 ? Sex.MALE : Sex.FEMALE;
	let traitHeight, traitWeight;

	if (Math.random() < 0.5) {
		traitHeight = firstParent.traitHeight;
		traitWeight = secondParent.traitWeight;
	} else {
		traitHeight = secondParent.traitHeight;
		traitWeight = firstParent.traitWeight;
	}

	return {
		id: generateId(),
		sex,
		traitHeight,
		traitWeight,
		x: 0,
		y: 0,
	};
};
