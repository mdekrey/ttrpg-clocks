import { ClockGameState } from "./ClockGameState";
import { ClockGame } from "./useClockGame";

function Clock({ name, clock: { currentTicks, totalTicks } }: { name: string; clock: ClockGameState["clocks"][0] }) {
	return (
		<button className="border border-gray-700 rounded flex flex-row sm:flex-col p-2 sm:h-64 sm:w-48 text-left sm:text-center mb-2 mx-1 items-center sm:items-stretch">
			<span className="block text-lg">{name}</span>
			<span className="sr-only">
				{currentTicks} of {totalTicks}
			</span>
			<span className="flex-grow flex items-center justify-center">
				<svg height={150} width={150}></svg>
			</span>
		</button>
	);
}

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
