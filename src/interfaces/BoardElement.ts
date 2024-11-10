import { Sex } from '../enum/Sex.ts';
import { Trait } from '../enum/Trait.ts';

export interface BoardElement {
	id: string;
	x: number;
	y: number;
	sex: Sex;
	traitHeight: Trait.SHORT | Trait.TALL;
	traitWeight: Trait.SLIM | Trait.FAT;
}
