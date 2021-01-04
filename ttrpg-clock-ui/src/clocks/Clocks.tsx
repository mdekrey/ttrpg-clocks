import { Clock } from "./Clock";
import { ClockGameState } from "./ClockGameState";
import { ClockGame } from "./useClockGame";

export const Clocks = ({
	clocks,
}: { clocks: ClockGameState["clocks"] } & Pick<ClockGame, "removeClock" | "tickClock" | "renameClock">) => {
	const keys = Object.keys(clocks).sort();
	return (
		<div className="flex flex-col sm:flex-row flex-wrap mt-2">
			{keys.map(key => (
				<Clock key={key} name={key} clock={clocks[key]} />
			))}
		</div>
	);
};
