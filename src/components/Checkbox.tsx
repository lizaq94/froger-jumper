import React from 'react';

interface IProps {
	isChecked: boolean;
	onChange: () => void;
}

export const Checkbox: React.FC<IProps> = (props): JSX.Element => {
	const { isChecked, onChange } = props;
	return <input type="checkbox" checked={isChecked} onChange={onChange} />;
};
