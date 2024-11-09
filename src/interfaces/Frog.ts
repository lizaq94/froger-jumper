import { Sex } from '../enum/Sex.ts';
import { Trait } from '../enum/Trait.ts';
import { BoardElement } from './BoardElement.ts';

export interface Frog extends BoardElement {
	sex: Sex;
	traitHeight: Trait.SHORT | Trait.TALL;
	traitWeight: Trait.SLIM | Trait.FAT;
}
