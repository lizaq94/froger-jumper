import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store.ts';
import { Sex } from '../enum/Sex.ts';
import { Trait } from '../enum/Trait.ts';
import { moveElement, setBoard, setElement, setNewAdjacentElement } from '../features/board/boardSlice.ts';
import { BoardData } from '../interfaces/BoardData.ts';
import { BoardElement } from '../interfaces/BoardElement.ts';
import { Coordinates } from '../types/Coordinates.ts';
import { findNearestMatch, isOppositeSexPartner } from '../utils/boardUtils.ts';
import { createNewFrog } from '../utils/frogUtils.ts';
import { generateId } from '../utils/uuidUtils.ts';
import { Button } from './Button.tsx';
import { Checkbox } from './Checkbox.tsx';
import { Frog } from './Frog.tsx';
import { TraitsInformation } from './TraitsInformation.tsx';

interface IProps {
	columns: number;
	rows: number;
}

export const Board: React.FC<IProps> = (props): JSX.Element => {
	const { columns, rows } = props;
	const [selectedFrog, setSelectedFrog] = useState<BoardElement | null>(null);
	const [fieldToMove, setFieldToMove] = useState<Coordinates | null>(null);
	const [selectedFrogPartner, setSelectedFrogPartner] = useState<BoardElement | null>(null);
	const board = useSelector((state: RootState) => state.board);
	const dispatch = useDispatch<AppDispatch>();
	const isBoardExist = board.fields.length > 0;

	useEffect(() => {
		if (selectedFrog) {
			const nearestFrogPartnerCoordinates = findNearestMatch(
				{ x: selectedFrog.x, y: selectedFrog.y },
				board,
				isOppositeSexPartner,
				selectedFrog,
				1
			);

			if (nearestFrogPartnerCoordinates)
				setSelectedFrogPartner(
					board.fields[nearestFrogPartnerCoordinates.y][nearestFrogPartnerCoordinates.x]?.element
				);
		}
	}, [selectedFrog, board]);

	const startHandler = () => {
		const maleFrog: BoardElement = {
			id: generateId(),
			sex: Sex.MALE,
			traitHeight: Trait.TALL,
			traitWeight: Trait.FAT,
			x: 3,
			y: 3,
		};

		const femaleFrog: BoardElement = {
			id: generateId(),
			sex: Sex.FEMALE,
			traitHeight: Trait.SHORT,
			traitWeight: Trait.SLIM,
			x: 4,
			y: 3,
		};

		dispatch(setBoard({ columns, rows }));
		dispatch(
			setElement({
				x: 3,
				y: 3,
				element: maleFrog,
			})
		);
		dispatch(
			setElement({
				x: 4,
				y: 3,
				element: femaleFrog,
			})
		);
	};

	const selectFrogHandler = (element: BoardElement) => {
		setSelectedFrog(element);
		setSelectedFrogPartner(null);
	};

	const moveHandler = () => {
		dispatch(
			moveElement({
				elementCoordinates: { x: selectedFrog!.x, y: selectedFrog!.y },
				newCoordinates: { x: fieldToMove!.x, y: fieldToMove!.y },
			})
		);
		setFieldToMove(null);
		setSelectedFrog(null);
		setSelectedFrogPartner(null);
	};

	const reproduceHandler = () => {
		if (!selectedFrog && !selectedFrogPartner) return;

		const newElement = createNewFrog(selectedFrog!, selectedFrogPartner!);
		const startElement = selectedFrog?.sex === Sex.FEMALE ? selectedFrog : selectedFrogPartner;

		dispatch(
			setNewAdjacentElement({
				startElementCoordinates: { x: startElement!.x, y: startElement!.y },
				newElement,
			})
		);
	};

	const renderRightSide = () => {
		const moveButtonEnabled = !!selectedFrog && !!fieldToMove;
		const reproducerButtonEnabled = selectedFrog && selectedFrogPartner;

		return (
			<div className="flex flex-col gap-5 ml-5">
				<Button isDisabled={!moveButtonEnabled} onClick={moveHandler}>
					Move
				</Button>
				<Button isDisabled={!reproducerButtonEnabled} onClick={reproduceHandler}>
					Reproduce
				</Button>
				<TraitsInformation element={selectedFrog} />
			</div>
		);
	};

	const renderField = (element: BoardElement | null, coordinates: Coordinates) => (
		<div className="w-20 h-20 border flex justify-center items-center has-[.selected]:border-blue-500">
			{element ? (
				<Frog
					frogData={element}
					isSelected={selectedFrog?.id === element.id}
					onSelect={() => selectFrogHandler(element)}
				/>
			) : (
				<Checkbox
					isChecked={fieldToMove?.x === coordinates.x && fieldToMove.y === coordinates.y}
					onChange={() => setFieldToMove(coordinates)}
				/>
			)}
		</div>
	);

	const renderBoard = (board: BoardData) => {
		if (!board?.fields.length) return null;

		return (
			<div className="border">
				{board.fields.map((rows, rowsIndex) => (
					<div className="flex">
						{rows.map((field, columnIndex) => renderField(field.element, { x: columnIndex, y: rowsIndex }))}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center">
			{!isBoardExist && (
				<button className="mb-10" onClick={startHandler}>
					Start
				</button>
			)}
			<div className="flex">
				{renderBoard(board)}
				{isBoardExist && <div>{renderRightSide()}</div>}
			</div>
		</div>
	);
};
