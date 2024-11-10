import React from 'react';
import { BoardElement } from '../interfaces/BoardElement.ts';

interface IProps {
	element: BoardElement | null;
}

export const TraitsInformation: React.FC<IProps> = (props) => {
	const { element } = props;

	if (!element) return null;

	return (
		<div className="text-left flex gap-1 md:flex-col md:gap-0">
			<p className="font-semibold">Traits:</p>
			<span>{element.traitHeight},</span>
			<span> {element.traitWeight}</span>
		</div>
	);
};
