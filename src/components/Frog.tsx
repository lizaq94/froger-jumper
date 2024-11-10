import React from 'react';
import { BoardElement } from '../interfaces/BoardElement.ts';
import maleImage from '../assets/img/male.png';
import femaleImage from '../assets/img/female.png';

interface IProps {
	frogData: BoardElement;
	onSelect?: () => void;
	isSelected?: boolean;
}

export const Frog: React.FC<IProps> = (props) => {
	const { frogData, onSelect, isSelected } = props;
	const backgroundImage = frogData.sex === 'male' ? maleImage : femaleImage;
	return (
		<div
			style={{ backgroundImage: `url(${backgroundImage})` }}
			className={`w-full h-full cursor-pointer bg-cover  ${isSelected ? 'selected border-2 border-blue-500' : ''}`}
			onClick={onSelect}
		/>
	);
};
