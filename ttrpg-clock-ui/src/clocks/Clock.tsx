import { useState } from "react";
import { EditorModal } from "../utils/EditorModal";
import { ClockGameState } from "./ClockGameState";
import { TickClockForm } from "./TickClock";
import { RenameClockForm } from "./RenameClock";
import { ClockGame } from "./useClockGame";
import { buttonStyles, ModalButton } from "../utils/Modal";
import { ClockSvg } from "./ClockSvg";

export function Clock({
	name,
	clock,
	removeClock,
	tickClock,
	renameClock,
}: {
	name: string;
	clock: ClockGameState["clocks"][0];
} & Partial<Pick<ClockGame, "removeClock" | "tickClock" | "renameClock">>) {
	const [showTickClock, setShowTickClock] = useState(false);
	const [showRenameClock, setShowRenameClock] = useState(false);

	return (
		<div className="sm:border sm:border-gray-700 rounded flex flex-row sm:flex-col p-2 sm:w-48 text-left sm:text-center mb-2 mx-1 items-stretch sm:shadow-xl">
			<button
				className="block text-lg flex-1 sm:flex-shrink-0 cursor-text"
				onClick={() => setShowRenameClock(true)}
			>
				{name}
			</button>
			<button className="flex items-center justify-center" onClick={() => setShowTickClock(true)}>
				<ClockSvg padding={2} radius={70} {...clock} />
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
				{modalData => <TickClockForm formData={modalData} {...clock} />}
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
