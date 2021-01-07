import { useMemo, useState } from "react";
import { arc, DefaultArcObject, pie } from "d3-shape";
import { EditorModal } from "../utils/EditorModal";
import { ClockGameState } from "./ClockGameState";
import { TickClockForm } from "./TickClock";
import { RenameClockForm } from "./RenameClock";
import { ClockGame } from "./useClockGame";
import { buttonStyles, ModalButton } from "../utils/Modal";

export function Clock({
	name,
	clock: { currentTicks, totalTicks },
	removeClock,
	tickClock,
	renameClock,
}: {
	name: string;
	clock: ClockGameState["clocks"][0];
} & Partial<Pick<ClockGame, "removeClock" | "tickClock" | "renameClock">>) {
	const padding = 2;
	const radius = 70;
	const clockArc = useMemo(
		() => arc<any, Pick<DefaultArcObject, "startAngle" | "endAngle">>().innerRadius(0).outerRadius(radius),
		[radius]
	);
	const clockPie = useMemo(() => pie()(Array(totalTicks).fill(1)), [totalTicks]);
	const [showTickClock, setShowTickClock] = useState(false);
	const [showRenameClock, setShowRenameClock] = useState(false);

	return (
		<div className="sm:border sm:border-gray-700 rounded flex flex-row sm:flex-col p-2 sm:h-64 sm:w-48 text-left sm:text-center mb-2 mx-1 items-center sm:items-stretch sm:shadow-xl">
			<button
				className="block text-lg flex-1 sm:flex-shrink-0 sm:flex-grow-0"
				onClick={() => setShowRenameClock(true)}
			>
				{name}
			</button>
			<button className="flex-grow flex items-center justify-center" onClick={() => setShowTickClock(true)}>
				<svg width={radius * 2 + padding} height={radius * 2 + padding}>
					<title>
						{currentTicks} of {totalTicks}
					</title>
					<g transform={`translate(${padding / 2 + radius} ${padding / 2 + radius})`}>
						{clockPie.map(piece => (
							<path
								key={piece.index}
								d={clockArc(piece)!}
								fill="currentcolor"
								stroke="black"
								strokeWidth={totalTicks <= 8 ? 2 : totalTicks <= 20 ? 1 : 0.5}
								className={piece.index < currentTicks ? "text-gray-700" : "text-gray-50"}
							/>
						))}
					</g>
				</svg>
			</button>
			<EditorModal
				show={tickClock ? showTickClock : false}
				onRequestHide={() => setShowTickClock(false)}
				setValueAndHide={value => {
					if (value !== 0) tickClock!(name, value);
					setShowTickClock(false);
				}}
				value={0}
				buttons={
					<ModalButton
						className={buttonStyles.red}
						onClick={() => {
							removeClock!(name);
							setShowRenameClock(false);
						}}
					>
						Delete
					</ModalButton>
				}
			>
				{modalData => (
					<TickClockForm formData={modalData} currentTicks={currentTicks} totalTicks={totalTicks} />
				)}
			</EditorModal>
			<EditorModal
				show={renameClock ? showRenameClock : false}
				onRequestHide={() => setShowRenameClock(false)}
				setValueAndHide={value => {
					if (value !== name) renameClock!(name, value);
					setShowRenameClock(false);
				}}
				value={name}
			>
				{modalData => <RenameClockForm formData={modalData} />}
			</EditorModal>
		</div>
	);
}
