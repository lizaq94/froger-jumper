import React, { ReactNode } from 'react';

interface IProps {
	children: ReactNode;
	isDisabled?: boolean;
	onClick?: () => void;
}

export const Button: React.FC<IProps> = (props): JSX.Element => {
	const { children, isDisabled, onClick } = props;
	const classes = isDisabled ? 'bg-gray-400 hover:cursor-default border-0' : '';
	return (
		<button className={classes} disabled={isDisabled} onClick={onClick}>
			{children}
		</button>
	);
};
