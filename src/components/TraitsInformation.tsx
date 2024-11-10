import React, { Fragment } from 'react';
import { BoardElement } from '../interfaces/BoardElement.ts';

interface IProps {
	element: BoardElement | null;
}

export const TraitsInformation: React.FC<IProps> = (props) => {
	const { element } = props;

	if (!element) return null;

	return (
		<div className="text-left">
			<p className="font-semibold">Traits:</p>
			<span>{element.traitHeight},</span>
			<span> {element.traitWeight}</span>
			<Fragment></Fragment>
		</div>
	);
};
