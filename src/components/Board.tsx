import React from 'react';

interface IProps {
	columns: number;
	rows: number;
}

export const Board: React.FC<IProps> = (props): JSX.Element => {
	const { columns, rows } = props;
	return <div>test</div>;
};
