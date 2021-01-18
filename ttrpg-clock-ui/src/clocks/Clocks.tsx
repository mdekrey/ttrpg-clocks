import { Clock } from "./Clock";
import { ClockGameState } from "./ClockGameState";
import { ClockGame } from "./useClockGame";

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export const Clocks = ({
	clocks,
	...clockFunctions
}: { clocks: ClockGameState["clocks"] } & Pick<ClockGame, "removeClock" | "tickClock" | "renameClock">) => {
	const keys = Object.keys(clocks).sort(collator.compare);
	if (keys.length === 0) return <p>No clocks have been added at this time.</p>;
	return (
		<div className="flex flex-col sm:flex-row flex-wrap mt-2">
			{keys.map(key => (
				<Clock key={key} name={key} clock={clocks[key]} {...clockFunctions} />
			))}
		</div>
	);
};
